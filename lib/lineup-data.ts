// ホームページ「その日並ぶベーグル」の表示データ取得（サーバー専用）。
// Supabase が未設定・エラー・0件のときは null を返し、呼び出し側で data/site.ts の
// 固定内容にフォールバックする（サイトが常に表示できるようにするため）。
import type { BagelTone } from "@/data/site";
import { getSupabaseAnonServer } from "@/lib/supabase/server";

export type LineupCard = {
  key: string;
  name: string;
  nameJa: string | null;
  description: string | null;
  tag: string | null;
  tone: BagelTone;
  image: string | null;
};

export async function loadLineupItems(): Promise<LineupCard[] | null> {
  const supabase = getSupabaseAnonServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("lineup_items")
    .select("*")
    .eq("is_public", true)
    .order("display_order", { ascending: true });

  if (error || !data || data.length === 0) return null;

  return data.map((r) => ({
    key: r.id as string,
    name: r.name as string,
    nameJa: (r.name_ja as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    tag: (r.tag as string | null) ?? null,
    tone: ((r.tone as string) ?? "golden") as BagelTone,
    image: (r.image_url as string | null) ?? null,
  }));
}
