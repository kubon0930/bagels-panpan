// ホームページ「その日並ぶベーグル」の表示データ取得（サーバー専用）。
// Supabase が未設定・エラー・0件のときは null を返し、呼び出し側で data/site.ts の
// 固定内容にフォールバックする（サイトが常に表示できるようにするため）。
import {
  normalizeBagelIllustration,
  type BagelIllustrationSpec,
} from "@/lib/bagel-illustration";
import { getSupabaseAnonServer } from "@/lib/supabase/server";

export type LineupCard = {
  key: string;
  name: string;
  nameJa: string | null;
  description: string | null;
  tag: string | null;
  /** ベース色×トッピング（旧 tone からの後方互換込み） */
  illustration: BagelIllustrationSpec;
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
    // 新カラム（bagel_base / bagel_topping）を優先し、無ければ旧 tone から変換
    illustration: normalizeBagelIllustration({
      base: (r.bagel_base as string | null) ?? null,
      topping: (r.bagel_topping as string | null) ?? null,
      tone: (r.tone as string | null) ?? null,
    }),
    image: (r.image_url as string | null) ?? null,
  }));
}
