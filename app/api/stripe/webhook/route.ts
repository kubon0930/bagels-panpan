import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { sendReservationEmails } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { getSupabaseService } from "@/lib/supabase/server";
import { PAYMENT_STATUS_LABELS } from "@/lib/reservation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook。
 * - checkout.session.completed → 支払い確定（paid / confirmed）
 * - checkout.session.expired   → 期限切れ（在庫を戻す）
 * - payment_intent.payment_failed → 失敗（在庫を戻す）
 * 署名検証を必ず行う。
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = getSupabaseService();

  if (!stripe || !webhookSecret || !supabase) {
    return new Response("Webhook not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        // 二重確定を避けるため、まだ未払いの注文だけを確定する
        const { data: order } = await supabase
          .from("orders")
          .select("id, order_status, reservation_code, customer_name, customer_email, total, sales_day_id, pickup_slot_id")
          .eq("id", orderId)
          .single();

        if (order && order.order_status === "pending_payment") {
          await supabase
            .from("orders")
            .update({
              order_status: "confirmed",
              payment_status: "paid",
              stripe_payment_intent_id:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            })
            .eq("id", orderId);

          // 確定メール（設定がある場合）
          const [{ data: day }, { data: slot }, { data: oItems }] = await Promise.all([
            supabase.from("sales_days").select("date").eq("id", order.sales_day_id).single(),
            order.pickup_slot_id
              ? supabase.from("pickup_slots").select("label").eq("id", order.pickup_slot_id).single()
              : Promise.resolve({ data: null }),
            supabase.from("order_items").select("product_name, quantity, line_total").eq("order_id", orderId),
          ]);

          await sendReservationEmails({
            code: order.reservation_code,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            dayLabel: day?.date ?? "",
            slotLabel: (slot as { label?: string } | null)?.label ?? "",
            paymentLabel: PAYMENT_STATUS_LABELS.paid,
            total: order.total,
            items: (oItems ?? []).map((i) => ({
              name: i.product_name,
              quantity: i.quantity,
              lineTotal: i.line_total,
            })),
          });
        }
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        // 在庫を戻す（cancel_order 内で二重解放を防止）
        await supabase.rpc("cancel_order", { p_order_id: orderId, p_new_status: "expired" });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.order_id;
      if (orderId) {
        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", orderId);
      }
    }
  } catch (err) {
    console.error("webhook handling error:", err);
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}
