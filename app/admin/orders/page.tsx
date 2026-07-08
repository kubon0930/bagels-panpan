"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa, yen } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type SalesDay,
} from "@/lib/reservation";
import { downloadOrdersCsv, type AdminOrderRow } from "@/lib/admin-csv";

export default function OrdersPage() {
  return (
    <AdminShell>
      <Orders />
    </AdminShell>
  );
}

function Orders() {
  const [days, setDays] = useState<SalesDay[]>([]);
  const [dayId, setDayId] = useState("");
  const [rows, setRows] = useState<AdminOrderRow[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    (async () => {
      const { data } = await supabase
        .from("sales_days")
        .select("*")
        .order("date", { ascending: false });
      setDays(data ?? []);
      if (data && data.length > 0) setDayId(data[0].id);
      setLoading(false);
    })();
  }, []);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !dayId) {
      setRows([]);
      return;
    }
    const { data } = await supabase
      .from("orders")
      .select(
        "*, pickup_slot:pickup_slots(label), items:order_items(product_name, quantity)",
      )
      .eq("sales_day_id", dayId)
      .order("created_at", { ascending: true });

    const day = days.find((d) => d.id === dayId);
    setRows(
      (data ?? []).map((o) => ({
        id: o.id,
        code: o.reservation_code,
        dateLabel: day ? formatDateJa(day.date) : "",
        slotLabel: (o.pickup_slot as { label?: string } | null)?.label ?? "",
        name: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email,
        items: (o.items ?? []).map((i: { product_name: string; quantity: number }) => ({
          name: i.product_name,
          quantity: i.quantity,
        })),
        total: o.total,
        orderStatus: o.order_status,
        paymentStatus: o.payment_status,
        note: o.customer_note ?? "",
      })),
    );
  }, [dayId, days]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (orderStatus && r.orderStatus !== orderStatus) return false;
      if (paymentStatus && r.paymentStatus !== paymentStatus) return false;
      if (keyword) {
        const k = keyword.toLowerCase();
        const hay = `${r.name} ${r.phone} ${r.email} ${r.items.map((i) => i.name).join(" ")}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });
  }, [rows, orderStatus, paymentStatus, keyword]);

  if (loading) return <p className="text-ink/60">読み込み中…</p>;

  const selectClass = "rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy";
  const dayLabel = days.find((d) => d.id === dayId)?.date ?? "";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-navy">予約一覧</h1>
        <button
          type="button"
          onClick={() => downloadOrdersCsv(filtered, dayLabel)}
          disabled={filtered.length === 0}
          className="rounded-full border border-navy/30 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy hover:text-paper disabled:opacity-40"
        >
          CSVで出力
        </button>
      </div>

      {days.length === 0 ? (
        <p className="mt-6 text-ink/70">販売日がありません。</p>
      ) : (
        <>
          {/* 絞り込み */}
          <div className="mt-5 flex flex-wrap gap-2">
            <select value={dayId} onChange={(e) => setDayId(e.target.value)} className={selectClass}>
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDateJa(d.date)}
                </option>
              ))}
            </select>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value as OrderStatus | "")} className={selectClass}>
              <option value="">すべての状態</option>
              {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus | "")} className={selectClass}>
              <option value="">すべての支払い</option>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="名前・電話・商品で検索"
              className={`${selectClass} min-w-52 flex-1`}
            />
          </div>

          <p className="mt-4 text-sm text-ink/60">{filtered.length}件</p>

          <div className="mt-2 space-y-3">
            {filtered.map((r) => (
              <Link
                key={r.id}
                href={`/admin/orders/${r.id}`}
                className="block rounded-card border border-line bg-warm p-4 shadow-warm transition-colors hover:border-navy/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display font-bold text-navy">{r.code}</span>
                  <div className="flex gap-2">
                    <StatusChip>{ORDER_STATUS_LABELS[r.orderStatus]}</StatusChip>
                    <StatusChip subtle>{PAYMENT_STATUS_LABELS[r.paymentStatus]}</StatusChip>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{r.name}様</span>
                  <span className="text-ink/60">{r.slotLabel}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  {r.items.map((i) => `${i.name}×${i.quantity}`).join("、")}
                </p>
                <p className="mt-1 text-sm font-bold text-navy">{yen(r.total)}</p>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-ink/60">該当する予約はありません。</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatusChip({ children, subtle }: { children: React.ReactNode; subtle?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${subtle ? "bg-cream text-ink/70" : "bg-navy/10 text-navy"}`}>
      {children}
    </span>
  );
}
