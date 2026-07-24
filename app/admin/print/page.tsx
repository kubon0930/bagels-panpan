"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderSlip, { type SlipOrder } from "@/components/admin/OrderSlip";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatTime } from "@/lib/format";
import {
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/reservation";

/** 支払い方法コードを日本語に */
function paymentMethodLabel(method: string | null, status: PaymentStatus): string {
  if (method === "stripe" || status === "paid") return "オンライン決済";
  return "店頭支払い（現金・PayPay）";
}

type RawOrder = {
  reservation_code: string;
  customer_name: string;
  customer_note: string | null;
  total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  created_at: string;
  sales_day: { date?: string } | null;
  pickup_slot: { label?: string; start_time?: string | null } | null;
  items: { product_name: string; quantity: number }[];
};

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "no_show",
];

function PrintInner() {
  const params = useSearchParams();
  const ids = params.get("ids");
  const dayId = params.get("day");
  const sort = params.get("sort"); // "pickup" のとき受け取り時間順→名前順

  const [orders, setOrders] = useState<SlipOrder[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("システムが未設定です。");
      return;
    }
    const select =
      "reservation_code, customer_name, customer_note, total, order_status, payment_status, payment_method, created_at, sales_day:sales_days(date), pickup_slot:pickup_slots(label, start_time), items:order_items(product_name, quantity)";

    let query = supabase.from("orders").select(select);
    if (ids) {
      query = query.in("id", ids.split(",").filter(Boolean));
    } else if (dayId) {
      query = query.eq("sales_day_id", dayId).in("order_status", ACTIVE_STATUSES);
    } else {
      setError("印刷対象が指定されていません。");
      return;
    }

    const { data, error: qErr } = await query;
    if (qErr) {
      setError("読み込みに失敗しました。ログイン状態をご確認ください。");
      return;
    }

    const raw = (data ?? []) as unknown as RawOrder[];
    const mapped: (SlipOrder & { _sort: string })[] = raw.map((o) => ({
      code: o.reservation_code,
      customerName: o.customer_name,
      date: o.sales_day?.date ?? "",
      slotLabel: o.pickup_slot?.label ?? "",
      items: (o.items ?? []).map((i) => ({ name: i.product_name, quantity: i.quantity })),
      total: o.total,
      paymentMethodLabel: paymentMethodLabel(o.payment_method, o.payment_status),
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      note: o.customer_note,
      // 並べ替えキー：受け取り開始時刻 → 名前
      _sort: `${o.pickup_slot?.start_time ?? "99:99"}__${o.customer_name}`,
    }));

    if (sort === "pickup" || dayId) {
      mapped.sort((a, b) => a._sort.localeCompare(b._sort, "ja"));
    }
    setOrders(mapped.map(({ _sort, ...rest }) => rest));
  }, [ids, dayId, sort]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
        <div>
          <p className="text-ink/70">{error}</p>
          <Link href="/admin/orders" className="mt-4 inline-block text-navy underline underline-offset-4">
            ← 予約一覧へ
          </Link>
        </div>
      </div>
    );
  }

  if (!orders) {
    return <div className="grid min-h-screen place-items-center text-ink/60">読み込み中…</div>;
  }

  return (
    <div className="print-root">
      {/* 画面表示時のみのツールバー（印刷には出ない） */}
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-warm px-5 py-4">
        <div>
          <p className="font-bold text-navy">注文票の印刷（{orders.length}件・B5縦・上下2件）</p>
          <p className="text-xs text-ink/60">
            ブラウザの印刷で「用紙サイズ：B5／余白：デフォルト」を選び、切り取り線で切って袋に貼ってください。
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/orders"
            className="rounded-full border border-navy/30 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy hover:text-paper"
          >
            戻る
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-paper hover:bg-navy-deep"
          >
            印刷する
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="no-print p-10 text-center text-ink/60">印刷対象の注文がありません。</p>
      ) : (
        <div className="slips">
          {orders.map((o, i) => (
            <OrderSlip key={`${o.code}-${i}`} order={o} />
          ))}
        </div>
      )}

      <style>{`
        .print-root { background: #f6f0e7; min-height: 100vh; }
        .slips {
          max-width: 176mm;
          margin: 0 auto;
          padding: 8mm 0;
        }
        .slip {
          background: #fff;
          box-sizing: border-box;
          padding: 8mm 10mm 4mm;
          margin: 0 8mm 8mm;
          border: 1px solid #ddd;
        }
        .slip-inner { min-height: 96mm; }
        .slip-head {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          border-bottom: 2px solid #102050;
          padding-bottom: 6px;
        }
        .slip-code { font-size: 15pt; font-weight: 700; color: #102050; letter-spacing: 0.04em; }
        .slip-name { font-size: 20pt; font-weight: 700; margin-top: 2px; }
        .slip-pickup { text-align: right; }
        .slip-date { font-size: 13pt; font-weight: 700; }
        .slip-slot { font-size: 15pt; font-weight: 700; color: #102050; margin-top: 2px; }
        .slip-items { list-style: none; margin: 10px 0; padding: 0; }
        .slip-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 16pt;
          padding: 5px 0;
          border-bottom: 1px dashed #ccc;
        }
        .slip-item-name { font-weight: 600; }
        .slip-item-qty { font-size: 18pt; font-weight: 700; white-space: nowrap; }
        .slip-foot { margin-top: 8px; }
        .slip-total { font-size: 16pt; font-weight: 700; color: #102050; }
        .slip-meta { font-size: 11pt; color: #444; margin-top: 3px; display: flex; flex-wrap: wrap; gap: 4px; }
        .slip-note { margin-top: 6px; font-size: 12pt; }
        .slip-cut {
          text-align: center;
          color: #999;
          font-size: 9pt;
          letter-spacing: 2px;
          margin-top: 4px;
          overflow: hidden;
          white-space: nowrap;
        }

        @media screen {
          .slip { border-radius: 8px; box-shadow: 0 6px 20px -12px rgba(16,32,80,0.2); }
        }

        @media print {
          /* B5(176×250mm)。余白を小さめにして印刷可能高さを稼ぎ、上下2件を確実に収める */
          @page { size: B5 portrait; margin: 6mm; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-root { background: #fff; }
          .slips { max-width: none; margin: 0; padding: 0; }
          .slip {
            margin: 0;
            border: none;
            padding: 0 0 2mm;
            break-inside: avoid;      /* 1枚が途中で切れないように */
          }
          /* 2件ごとに改ページ＝必ず1ページに上下2件 */
          .slip:nth-child(2n) { break-after: page; page-break-after: always; }
          .slip:last-child { break-after: auto; page-break-after: auto; }
          .slip-inner {
            /* 印刷可能高さ ≈ 250-12=238mm。半分弱に収める（余白/線ぶんを差し引く） */
            min-height: 110mm;
            border: 1.5px solid #333;
            border-radius: 4px;
            padding: 5mm;
            box-sizing: border-box;
          }
          .slip-cut { display: none; }  /* 上下2件の境界で切るため線は不要 */
        }
      `}</style>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-ink/60">読み込み中…</div>}>
      <PrintInner />
    </Suspense>
  );
}
