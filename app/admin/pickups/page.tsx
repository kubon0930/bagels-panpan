"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa } from "@/lib/format";
import {
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type SalesDay,
} from "@/lib/reservation";

export default function PickupsPage() {
  return (
    <AdminShell>
      <Pickups />
    </AdminShell>
  );
}

type PickupOrder = {
  id: string;
  code: string;
  name: string;
  slotLabel: string;
  slotSort: string;
  items: { name: string; quantity: number }[];
  note: string | null;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
};

type StatusFilter = "all" | "not_picked" | "picked";

/** 受け取りステータスの分類 */
function category(status: OrderStatus): "picked" | "cancelled" | "not_picked" {
  if (status === "picked_up") return "picked";
  if (status === "cancelled" || status === "expired" || status === "no_show") return "cancelled";
  return "not_picked";
}

function Pickups() {
  const [days, setDays] = useState<SalesDay[]>([]);
  const [dayId, setDayId] = useState("");
  const [orders, setOrders] = useState<PickupOrder[]>([]);
  const [slotFilter, setSlotFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [keyword, setKeyword] = useState("");
  const [busyId, setBusyId] = useState("");
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
      // 既定は「今日」→ なければ最新
      const todayStr = new Date().toLocaleDateString("sv-SE");
      const today = (data ?? []).find((d) => d.date === todayStr);
      setDayId(today?.id ?? data?.[0]?.id ?? "");
      setLoading(false);
    })();
  }, []);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !dayId) {
      setOrders([]);
      return;
    }
    const { data } = await supabase
      .from("orders")
      .select(
        "id, reservation_code, customer_name, customer_note, order_status, payment_status, pickup_slot:pickup_slots(label, start_time), items:order_items(product_name, quantity)",
      )
      .eq("sales_day_id", dayId);

    setOrders(
      (data ?? []).map((o) => {
        const slot = o.pickup_slot as { label?: string; start_time?: string | null } | null;
        return {
          id: o.id as string,
          code: o.reservation_code as string,
          name: o.customer_name as string,
          slotLabel: slot?.label ?? "時間未設定",
          slotSort: slot?.start_time ?? "99:99",
          items: ((o.items ?? []) as { product_name: string; quantity: number }[]).map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
          })),
          note: (o.customer_note as string | null) ?? null,
          paymentStatus: o.payment_status as PaymentStatus,
          orderStatus: o.order_status as OrderStatus,
        };
      }),
    );
  }, [dayId]);

  useEffect(() => {
    load();
  }, [load]);

  async function setPicked(id: string, picked: boolean) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusyId(id);
    await supabase
      .from("orders")
      .update({ order_status: picked ? "picked_up" : "confirmed" })
      .eq("id", id);
    setBusyId("");
    load();
  }

  // フィルタ適用
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const cat = category(o.orderStatus);
      if (slotFilter && o.slotLabel !== slotFilter) return false;
      if (statusFilter === "not_picked" && cat !== "not_picked") return false;
      if (statusFilter === "picked" && cat !== "picked") return false;
      if (keyword) {
        const k = keyword.toLowerCase();
        if (!`${o.code} ${o.name}`.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [orders, slotFilter, statusFilter, keyword]);

  // 受け取り時間帯ごとにグループ化（時間順）
  const groups = useMemo(() => {
    const map = new Map<string, { label: string; sort: string; list: PickupOrder[] }>();
    for (const o of filtered) {
      const key = o.slotLabel;
      if (!map.has(key)) map.set(key, { label: o.slotLabel, sort: o.slotSort, list: [] });
      map.get(key)!.list.push(o);
    }
    const arr = [...map.values()];
    arr.sort((a, b) => a.sort.localeCompare(b.sort));
    for (const g of arr) g.list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    return arr;
  }, [filtered]);

  const slotOptions = useMemo(
    () => [...new Set(orders.map((o) => o.slotLabel))],
    [orders],
  );

  const counts = useMemo(() => {
    let notPicked = 0;
    let picked = 0;
    for (const o of orders) {
      const c = category(o.orderStatus);
      if (c === "not_picked") notPicked++;
      else if (c === "picked") picked++;
    }
    return { notPicked, picked };
  }, [orders]);

  if (loading) return <p className="text-ink/60">読み込み中…</p>;

  const selectClass =
    "rounded-lg border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-navy";

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">受け取り管理</h1>
      <p className="mt-1 text-sm text-ink/70">
        受け取り時間順に並んでいます。お渡ししたらボタンを押してください。
      </p>

      {days.length === 0 ? (
        <p className="mt-6 text-ink/70">販売日がありません。</p>
      ) : (
        <>
          {/* 集計 */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="未受け取り" value={counts.notPicked} accent />
            <Stat label="受け取り済み" value={counts.picked} />
            <Stat label="残り" value={counts.notPicked} />
          </div>

          {/* フィルタ */}
          <div className="mt-5 flex flex-wrap gap-2">
            <select value={dayId} onChange={(e) => setDayId(e.target.value)} className={selectClass}>
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDateJa(d.date)}
                </option>
              ))}
            </select>
            <select value={slotFilter} onChange={(e) => setSlotFilter(e.target.value)} className={selectClass}>
              <option value="">すべての時間帯</option>
              {slotOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={selectClass}
            >
              <option value="all">すべて</option>
              <option value="not_picked">未受け取りのみ</option>
              <option value="picked">受け取り済みのみ</option>
            </select>
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="名前・注文番号で検索"
              className={`${selectClass} min-w-52 flex-1`}
            />
          </div>

          {/* 時間帯グループ */}
          <div className="mt-6 space-y-8">
            {groups.length === 0 && (
              <p className="py-8 text-center text-sm text-ink/60">該当する予約はありません。</p>
            )}
            {groups.map((g) => (
              <section key={g.label}>
                <h2 className="sticky top-[104px] z-10 -mx-1 rounded-lg bg-navy px-4 py-2 text-lg font-bold text-paper">
                  {g.label}
                  <span className="ml-2 text-sm font-normal text-paper/70">{g.list.length}件</span>
                </h2>
                <div className="mt-3 space-y-3">
                  {g.list.map((o) => (
                    <PickupCard
                      key={o.id}
                      order={o}
                      busy={busyId === o.id}
                      onToggle={(picked) => setPicked(o.id, picked)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PickupCard({
  order,
  busy,
  onToggle,
}: {
  order: PickupOrder;
  busy: boolean;
  onToggle: (picked: boolean) => void;
}) {
  const cat = category(order.orderStatus);

  const style =
    cat === "picked"
      ? "border-line bg-cream text-ink/50"
      : cat === "cancelled"
        ? "border-bagel/40 bg-bagel/5"
        : "border-navy/25 bg-warm";

  return (
    <div className={`rounded-card border-2 p-4 shadow-warm ${style}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-bold">{order.name} 様</span>
            {cat === "picked" && (
              <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-bold text-ink/60">
                受け取り済み
              </span>
            )}
            {cat === "cancelled" && (
              <span className="rounded-full bg-bagel/15 px-2.5 py-0.5 text-xs font-bold text-bagel">
                キャンセル
              </span>
            )}
          </div>
          <p className="mt-0.5 font-display text-sm text-ink/60">{order.code}</p>
          <p className="mt-2 text-base font-medium">
            {order.items.map((i) => `${i.name}×${i.quantity}`).join("、")}
          </p>
          {order.note && (
            <p className="mt-1 text-sm text-bagel">備考：{order.note}</p>
          )}
          <p className="mt-1 text-xs text-ink/50">
            支払い：{PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </p>
        </div>

        {cat !== "cancelled" && (
          <div className="shrink-0">
            {cat === "not_picked" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => onToggle(true)}
                className="rounded-full bg-navy px-6 py-3 text-base font-bold text-paper hover:bg-navy-deep disabled:opacity-50"
              >
                受け渡し済みにする
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => onToggle(false)}
                className="rounded-full border border-navy/30 px-5 py-2.5 text-sm font-medium text-navy/70 hover:bg-navy hover:text-paper disabled:opacity-50"
              >
                受け取りを取り消す
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-card border p-4 text-center ${accent ? "border-navy/40 bg-navy/5" : "border-line bg-warm"}`}>
      <p className="text-xs text-ink/60">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ? "text-navy" : "text-ink/70"}`}>{value}</p>
    </div>
  );
}
