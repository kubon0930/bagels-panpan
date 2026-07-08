// 予約ページ用のデータ取得（サーバー専用）。anonクライアント＋RLSで公開分だけ取得する。
import { formatDateJa, formatTime } from "@/lib/format";
import { getSupabaseAnonServer } from "@/lib/supabase/server";

export type ReserveItem = {
  salesItemId: string;
  name: string;
  description: string | null;
  price: number;
  remaining: number;
  soldOut: boolean;
  isSeasonal: boolean;
  isRecommended: boolean;
  allergyNote: string | null;
};

export type ReserveSlot = {
  id: string;
  label: string;
  full: boolean;
};

export type ReserveDay = {
  id: string;
  date: string;
  dateLabel: string;
  title: string | null;
  description: string | null;
  note: string | null;
  pickupNote: string;
  acceptingOrders: boolean;
  withinWindow: boolean;
  reservationEndAt: string | null;
  slots: ReserveSlot[];
  items: ReserveItem[];
};

/**
 * 公開中・受付中の販売日を、受け取り時間帯と商品つきで取得する。
 * Supabase 未設定時は null（呼び出し側で「準備中」表示）。
 */
export async function loadReserveDays(): Promise<ReserveDay[] | null> {
  const supabase = getSupabaseAnonServer();
  if (!supabase) return null;

  const today = new Date().toISOString().slice(0, 10);
  const { data: days, error } = await supabase
    .from("sales_days")
    .select("*")
    .eq("is_public", true)
    .gte("date", today)
    .order("date", { ascending: true });

  if (error || !days || days.length === 0) return [];

  const now = Date.now();
  const result: ReserveDay[] = [];

  for (const day of days) {
    const [{ data: slots }, { data: items }] = await Promise.all([
      supabase
        .from("pickup_slots")
        .select("*")
        .eq("sales_day_id", day.id)
        .eq("is_public", true)
        .order("start_time", { ascending: true }),
      supabase
        .from("sales_items")
        .select("*, product:products(*)")
        .eq("sales_day_id", day.id)
        .eq("is_public", true)
        .order("display_order", { ascending: true }),
    ]);

    const startAt = day.reservation_start_at
      ? new Date(day.reservation_start_at).getTime()
      : null;
    const endAt = day.reservation_end_at
      ? new Date(day.reservation_end_at).getTime()
      : null;
    const withinWindow =
      (startAt === null || startAt <= now) && (endAt === null || endAt >= now);

    const pickupNote =
      day.pickup_start_time && day.pickup_end_time
        ? `${formatTime(day.pickup_start_time)}〜${formatTime(day.pickup_end_time)} 受け取り`
        : "";

    result.push({
      id: day.id,
      date: day.date,
      dateLabel: formatDateJa(day.date),
      title: day.title,
      description: day.description,
      note: day.note,
      pickupNote,
      acceptingOrders: day.is_accepting_orders,
      withinWindow,
      reservationEndAt: day.reservation_end_at,
      slots: (slots ?? []).map((s) => ({
        id: s.id,
        label: s.label,
        full: s.capacity !== null && s.reserved_count >= s.capacity,
      })),
      items: (items ?? []).map((it) => {
        const remaining = Math.max(it.stock_quantity - it.reserved_quantity, 0);
        const product = (it.product ?? {}) as {
          name?: string;
          description?: string | null;
          allergy_note?: string | null;
        };
        return {
          salesItemId: it.id,
          name: product.name ?? "商品",
          description: product.description ?? null,
          price: it.price,
          remaining,
          soldOut: remaining <= 0,
          isSeasonal: it.is_seasonal,
          isRecommended: it.is_recommended,
          allergyNote: product.allergy_note ?? null,
        };
      }),
    });
  }

  return result;
}
