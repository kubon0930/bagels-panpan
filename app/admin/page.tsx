"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa } from "@/lib/format";

type Dashboard = {
  dayId: string | null;
  dayLabel: string;
  orderCount: number;
  productCounts: { name: string; qty: number }[];
  slotCounts: { label: string; count: number; capacity: number | null }[];
  notPickedUp: number;
  pickedUp: number;
  soldOut: string[];
};

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  );
}

function Dashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: days } = await supabase
        .from("sales_days")
        .select("*")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1);
      const day = days?.[0];

      if (!day) {
        setData({
          dayId: null,
          dayLabel: "",
          orderCount: 0,
          productCounts: [],
          slotCounts: [],
          notPickedUp: 0,
          pickedUp: 0,
          soldOut: [],
        });
        setLoading(false);
        return;
      }

      const [{ data: orders }, { data: slots }, { data: items }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, order_status")
          .eq("sales_day_id", day.id),
        supabase
          .from("pickup_slots")
          .select("label, reserved_count, capacity")
          .eq("sales_day_id", day.id)
          .order("start_time", { ascending: true }),
        supabase
          .from("sales_items")
          .select("stock_quantity, reserved_quantity, product:products(name)")
          .eq("sales_day_id", day.id)
          .order("display_order", { ascending: true }),
      ]);

      const activeOrders = (orders ?? []).filter(
        (o) => !["cancelled", "expired"].includes(o.order_status),
      );
      const orderIds = activeOrders.map((o) => o.id);

      // 商品別予約数
      let productCounts: { name: string; qty: number }[] = [];
      if (orderIds.length > 0) {
        const { data: oItems } = await supabase
          .from("order_items")
          .select("product_name, quantity, order_id")
          .in("order_id", orderIds);
        const map = new Map<string, number>();
        for (const oi of oItems ?? []) {
          map.set(oi.product_name, (map.get(oi.product_name) ?? 0) + oi.quantity);
        }
        productCounts = [...map.entries()].map(([name, qty]) => ({ name, qty }));
      }

      const notPickedUp = activeOrders.filter((o) =>
        ["confirmed", "preparing", "ready"].includes(o.order_status),
      ).length;
      const pickedUp = activeOrders.filter((o) => o.order_status === "picked_up").length;

      const soldOut = (items ?? [])
        .filter((it) => it.stock_quantity - it.reserved_quantity <= 0)
        .map((it) => (it.product as { name?: string } | null)?.name ?? "商品");

      setData({
        dayId: day.id,
        dayLabel: formatDateJa(day.date),
        orderCount: activeOrders.length,
        productCounts,
        slotCounts: (slots ?? []).map((s) => ({
          label: s.label,
          count: s.reserved_count,
          capacity: s.capacity,
        })),
        notPickedUp,
        pickedUp,
        soldOut,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) {
    return <p className="text-ink/60">読み込み中…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-navy">ダッシュボード</h1>
        <Link
          href="/admin/sales-days"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy-deep"
        >
          ＋ 新しい販売日を作る
        </Link>
      </div>

      {!data.dayId ? (
        <div className="mt-8 rounded-card border border-line bg-warm p-8 text-center">
          <p className="font-bold text-navy">これからの販売日がありません</p>
          <p className="mt-2 text-sm text-ink/70">
            「販売日」から新しい販売日を登録してください。
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink/70">次回販売日</p>
          <p className="text-lg font-bold text-navy">{data.dayLabel}</p>

          {/* 今日の受け取り */}
          <div className="mt-4 rounded-card border-2 border-navy/15 bg-warm p-5 shadow-warm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-bagel">今日の受け取り</h2>
              <Link
                href="/admin/pickups"
                className="rounded-full bg-navy px-5 py-2 text-sm font-bold text-paper hover:bg-navy-deep"
              >
                受け取り管理を開く →
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <BigStat label="未受け取り" value={data.notPickedUp} accent />
              <BigStat label="受け取り済み" value={data.pickedUp} />
              <BigStat label="残り" value={data.notPickedUp} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat label="予約数" value={`${data.orderCount}件`} />
            <Stat label="未受け取り" value={`${data.notPickedUp}件`} accent />
            <Stat
              label="売り切れ商品"
              value={data.soldOut.length > 0 ? data.soldOut.join("・") : "なし"}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Panel title="商品別 予約数">
              {data.productCounts.length === 0 ? (
                <p className="text-sm text-ink/60">まだ予約はありません。</p>
              ) : (
                <ul className="space-y-2">
                  {data.productCounts.map((p) => (
                    <li key={p.name} className="flex justify-between text-sm">
                      <span>{p.name}</span>
                      <span className="font-bold text-navy">{p.qty}個</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="受け取り時間帯別">
              {data.slotCounts.length === 0 ? (
                <p className="text-sm text-ink/60">時間帯が未設定です。</p>
              ) : (
                <ul className="space-y-2">
                  {data.slotCounts.map((s) => (
                    <li key={s.label} className="flex justify-between text-sm">
                      <span>{s.label}</span>
                      <span className="font-bold text-navy">
                        {s.count}
                        {s.capacity !== null ? ` / ${s.capacity}` : ""}件
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <div className="mt-6">
            <Link
              href="/admin/orders"
              className="inline-flex rounded-full border border-navy/30 px-6 py-3 text-sm font-medium text-navy hover:bg-navy hover:text-paper"
            >
              予約一覧を見る →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-card border p-5 ${accent ? "border-toast/50 bg-toast/10" : "border-line bg-warm"}`}>
      <p className="text-xs text-ink/60">{label}</p>
      <p className="mt-1 text-xl font-bold text-navy">{value}</p>
    </div>
  );
}

function BigStat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${accent ? "border-navy/40 bg-navy/5" : "border-line bg-cream"}`}>
      <p className="text-xs text-ink/60">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ? "text-navy" : "text-ink/70"}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-warm p-5">
      <h2 className="mb-3 text-sm font-bold text-bagel">{title}</h2>
      {children}
    </div>
  );
}
