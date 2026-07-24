import type { NextRequest } from "next/server";
import { sendReservationEmails } from "@/lib/email";
import { serverPaymentMode, siteBaseUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getSupabaseService } from "@/lib/supabase/server";
import { PAYMENT_STATUS_LABELS } from "@/lib/reservation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  salesDayId?: string;
  pickupSlotId?: string;
  customerName?: string;
  customerNameKana?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNote?: string;
  agreed?: boolean;
  items?: { salesItemId: string; quantity: number }[];
};

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const supabase = getSupabaseService();
  if (!supabase) {
    return bad(
      "予約システムは現在準備中です。最新情報はInstagramをご確認ください。",
      503,
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad("リクエストの形式が正しくありません。");
  }

  // 入力チェック
  const name = body.customerName?.trim();
  const nameKana = body.customerNameKana?.trim();
  const phone = body.customerPhone?.trim();
  const email = body.customerEmail?.trim();
  if (!body.salesDayId || !body.pickupSlotId) return bad("販売日と受け取り時間帯を選択してください。");
  if (!name) return bad("お名前を入力してください。");
  if (!nameKana) return bad("お名前のフリガナを入力してください。");
  if (!phone) return bad("電話番号を入力してください。");
  if (!email || !EMAIL_RE.test(email)) return bad("正しいメールアドレスを入力してください。");
  if (!body.agreed) return bad("注意事項へのご同意が必要です。");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bad("商品を1つ以上選択してください。");
  }
  const items = body.items.filter((i) => i.quantity > 0);
  if (items.length === 0) return bad("数量を1つ以上選択してください。");

  const paymentMode = serverPaymentMode();

  // 在庫確認と注文作成を1トランザクションで行う（DB関数）
  const { data, error } = await supabase.rpc("create_order", {
    p_sales_day_id: body.salesDayId,
    p_pickup_slot_id: body.pickupSlotId,
    p_customer_name: name,
    p_customer_name_kana: nameKana,
    p_customer_phone: phone,
    p_customer_email: email,
    p_customer_note: body.customerNote?.trim() || null,
    p_items: items.map((i) => ({ sales_item_id: i.salesItemId, quantity: i.quantity })),
    p_payment_mode: paymentMode,
  });

  if (error) {
    // DB関数が投げたエラーコードをそのまま返し、クライアント側で日本語化する
    return bad(error.message, 409);
  }

  const result = data as {
    order_id: string;
    reservation_code: string;
    total: number;
    items: { name: string; unit_price: number; quantity: number; line_total: number }[];
  };

  // 販売日・受け取り時間帯のラベルを取得（メール・完了画面用）
  const { data: day } = await supabase
    .from("sales_days")
    .select("date")
    .eq("id", body.salesDayId)
    .single();
  const { data: slot } = await supabase
    .from("pickup_slots")
    .select("label")
    .eq("id", body.pickupSlotId)
    .single();

  // Stripe 決済モード：Checkout セッションを作成
  if (paymentMode === "stripe") {
    const stripe = getStripe();
    if (!stripe) {
      // 想定外（serverPaymentModeがstripeなのにキーが無い）：在庫を戻す
      await supabase.rpc("cancel_order", { p_order_id: result.order_id, p_new_status: "cancelled" });
      return bad("決済の準備に失敗しました。時間をおいてお試しください。", 500);
    }

    const base = siteBaseUrl();
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        locale: "ja",
        customer_email: email,
        line_items: result.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: "jpy",
            unit_amount: i.unit_price,
            product_data: { name: i.name },
          },
        })),
        metadata: { order_id: result.order_id, reservation_code: result.reservation_code },
        // PaymentIntent にも order_id を載せる（payment_intent.payment_failed で注文を特定するため。
        // セッションの metadata は PaymentIntent には自動で引き継がれない）
        payment_intent_data: {
          metadata: { order_id: result.order_id, reservation_code: result.reservation_code },
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        success_url: `${base}/reserve/complete?code=${result.reservation_code}`,
        cancel_url: `${base}/reserve/cancel?order=${result.order_id}`,
      });

      await supabase
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", result.order_id);

      return Response.json({
        mode: "stripe",
        checkoutUrl: session.url,
        code: result.reservation_code,
      });
    } catch (e) {
      console.error("stripe session failed:", e);
      await supabase.rpc("cancel_order", { p_order_id: result.order_id, p_new_status: "cancelled" });
      return bad("決済ページの作成に失敗しました。もう一度お試しください。", 500);
    }
  }

  // 予約のみモード：メール送信（設定がある場合）して完了
  await sendReservationEmails({
    code: result.reservation_code,
    customerName: name,
    customerEmail: email,
    dayLabel: day?.date ?? "",
    slotLabel: slot?.label ?? "",
    paymentLabel: PAYMENT_STATUS_LABELS.pay_at_store,
    total: result.total,
    items: result.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      lineTotal: i.line_total,
    })),
  });

  return Response.json({
    mode: "reservation_only",
    code: result.reservation_code,
    total: result.total,
    dayLabel: day?.date ?? "",
    slotLabel: slot?.label ?? "",
    items: result.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      lineTotal: i.line_total,
    })),
  });
}
