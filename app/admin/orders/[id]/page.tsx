"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa, formatDateTimeShort, yen } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/reservation";

export default function OrderDetailPage() {
  return (
    <AdminShell>
      <OrderDetail />
    </AdminShell>
  );
}

// キャンセル系（在庫を戻す）は RPC 経由、それ以外は直接更新
const STOCK_RESTORING: OrderStatus[] = ["cancelled", "expired", "no_show"];

type FullOrder = Order & {
  items: OrderItem[];
  dayLabel: string;
  slotLabel: string;
};

function OrderDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [order, setOrder] = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(*), sales_day:sales_days(date), pickup_slot:pickup_slots(label)")
      .eq("id", id)
      .single();
    if (data) {
      setOrder({
        ...(data as Order),
        items: (data.items ?? []) as OrderItem[],
        dayLabel: (data.sales_day as { date?: string } | null)?.date
          ? formatDateJa((data.sales_day as { date: string }).date)
          : "",
        slotLabel: (data.pickup_slot as { label?: string } | null)?.label ?? "",
      });
      setAdminNote(data.admin_note ?? "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeOrderStatus(next: OrderStatus) {
    const supabase = getSupabaseBrowser();
    if (!supabase || !order) return;
    setBusy(true);
    if (STOCK_RESTORING.includes(next)) {
      await supabase.rpc("cancel_order", { p_order_id: order.id, p_new_status: next });
    } else {
      await supabase.from("orders").update({ order_status: next }).eq("id", order.id);
    }
    setBusy(false);
    load();
  }

  async function changePaymentStatus(next: PaymentStatus) {
    const supabase = getSupabaseBrowser();
    if (!supabase || !order) return;
    setBusy(true);
    await supabase.from("orders").update({ payment_status: next }).eq("id", order.id);
    setBusy(false);
    load();
  }

  async function saveAdminNote() {
    const supabase = getSupabaseBrowser();
    if (!supabase || !order) return;
    await supabase.from("orders").update({ admin_note: adminNote || null }).eq("id", order.id);
    load();
  }

  if (loading) return <p className="text-ink/60">読み込み中…</p>;
  if (!order) {
    return (
      <div>
        <p className="text-ink/70">予約が見つかりません。</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-navy underline underline-offset-4">
          ← 予約一覧へ
        </Link>
      </div>
    );
  }

  const selectClass = "rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy";

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-navy underline underline-offset-4">
        ← 予約一覧へ
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">{order.reservation_code}</h1>
          <span className="text-sm text-ink/60">受付：{formatDateTimeShort(order.created_at)}</span>
        </div>
        <Link
          href={`/admin/print?ids=${order.id}`}
          target="_blank"
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-paper hover:bg-navy-deep"
        >
          🖨 注文票を印刷
        </Link>
      </div>

      {/* ステータス変更 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line bg-warm p-5 shadow-warm">
          <p className="mb-2 text-sm font-bold text-bagel">注文ステータス</p>
          <select
            value={order.order_status}
            disabled={busy}
            onChange={(e) => changeOrderStatus(e.target.value as OrderStatus)}
            className={`${selectClass} w-full`}
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-ink/60">
            キャンセル・期限切れにすると在庫が自動的に戻ります。
          </p>
        </div>
        <div className="rounded-card border border-line bg-warm p-5 shadow-warm">
          <p className="mb-2 text-sm font-bold text-bagel">支払いステータス</p>
          <select
            value={order.payment_status}
            disabled={busy}
            onChange={(e) => changePaymentStatus(e.target.value as PaymentStatus)}
            className={`${selectClass} w-full`}
          >
            {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 予約内容 */}
      <div className="mt-4 rounded-card border border-line bg-warm p-5 shadow-warm">
        <p className="mb-3 text-sm font-bold text-bagel">ご予約内容</p>
        <Row label="受け取り日" value={order.dayLabel} />
        <Row label="受け取り時間" value={order.slotLabel} />
        <ul className="mt-3 divide-y divide-line border-t border-line">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2 text-sm">
              <span>{i.product_name} × {i.quantity}</span>
              <span className="font-medium">{yen(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-line pt-3 font-bold text-navy">
          <span>合計</span>
          <span>{yen(order.total)}</span>
        </div>
      </div>

      {/* お客様情報 */}
      <div className="mt-4 rounded-card border border-line bg-warm p-5 shadow-warm">
        <p className="mb-3 text-sm font-bold text-bagel">お客様情報</p>
        <Row label="お名前" value={`${order.customer_name} 様`} />
        {order.customer_name_kana && <Row label="フリガナ" value={order.customer_name_kana} />}
        <Row label="電話番号" value={<a href={`tel:${order.customer_phone}`} className="text-navy underline underline-offset-2">{order.customer_phone}</a>} />
        <Row label="メール" value={<a href={`mailto:${order.customer_email}`} className="break-all text-navy underline underline-offset-2">{order.customer_email}</a>} />
        {order.customer_note && <Row label="備考" value={order.customer_note} />}
      </div>

      {/* 管理メモ */}
      <div className="mt-4 rounded-card border border-line bg-warm p-5 shadow-warm">
        <p className="mb-2 text-sm font-bold text-bagel">管理メモ（店舗用）</p>
        <textarea
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          onBlur={saveAdminNote}
          rows={3}
          className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy"
          placeholder="店頭での連絡事項など"
        />
      </div>

      {/* キャンセル */}
      {!["cancelled", "expired"].includes(order.order_status) && (
        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (confirm("この予約をキャンセルしますか？（在庫が戻ります）")) {
                changeOrderStatus("cancelled");
              }
            }}
            className="rounded-full border border-bagel/50 px-6 py-2.5 text-sm font-medium text-bagel hover:bg-bagel hover:text-warm disabled:opacity-50"
          >
            この予約をキャンセルする
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-ink/60">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
