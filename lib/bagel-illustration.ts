/**
 * ベーグルイラストの「ベース色 × トッピング」定義。
 * 管理画面・トップページLineup・（将来の）予約ページ・migration で共通利用する。
 *
 * 旧仕様（lineup_items.tone / data/site.ts の BagelTone）は単一選択だったため、
 * legacyToBagelIllustration と normalizeBagelIllustration で後方互換を保つ。
 */
import type { BagelTone } from "@/data/site";

export type BagelBase =
  | "plain"
  | "golden"
  | "whole_wheat"
  | "cheese"
  | "chocolate"
  | "matcha"
  | "berry"
  | "pumpkin"
  | "seasonal";

export type BagelTopping =
  | "none"
  | "sesame"
  | "black_sesame"
  | "cheese_crust"
  | "chocolate_chip"
  | "cinnamon"
  | "sugar"
  | "seeds";

export type BagelIllustrationSpec = {
  base: BagelBase;
  topping: BagelTopping;
};

export const bagelBaseOptions: { value: BagelBase; label: string }[] = [
  { value: "plain", label: "プレーン" },
  { value: "golden", label: "こんがり" },
  { value: "whole_wheat", label: "全粒粉" },
  { value: "cheese", label: "チーズ" },
  { value: "chocolate", label: "チョコ" },
  { value: "matcha", label: "抹茶" },
  { value: "berry", label: "ベリー" },
  { value: "pumpkin", label: "パンプキン" },
  { value: "seasonal", label: "季節限定" },
];

export const bagelToppingOptions: { value: BagelTopping; label: string }[] = [
  { value: "none", label: "なし" },
  { value: "sesame", label: "セサミ" },
  { value: "black_sesame", label: "黒ごま" },
  { value: "cheese_crust", label: "焼きチーズ" },
  { value: "chocolate_chip", label: "チョコチップ" },
  { value: "cinnamon", label: "シナモン" },
  { value: "sugar", label: "シュガー" },
  { value: "seeds", label: "シード" },
];

const baseValues = new Set(bagelBaseOptions.map((o) => o.value));
const toppingValues = new Set(bagelToppingOptions.map((o) => o.value));

/** 旧「焼き色」単一選択からの変換表 */
export const legacyToBagelIllustration: Record<BagelTone, BagelIllustrationSpec> = {
  golden: { base: "golden", topping: "none" },
  cheese: { base: "cheese", topping: "cheese_crust" },
  chocolate: { base: "chocolate", topping: "chocolate_chip" },
  seasonal: { base: "seasonal", topping: "none" },
};

/**
 * DBやフォームから来た値を安全な組み合わせに正規化する。
 * 1. bagel_base / bagel_topping が有効ならそれを優先
 * 2. 無ければ旧 tone から変換
 * 3. どちらも無ければ golden × なし
 */
export function normalizeBagelIllustration(input: {
  base?: string | null;
  topping?: string | null;
  tone?: string | null;
}): BagelIllustrationSpec {
  const legacy =
    input.tone && input.tone in legacyToBagelIllustration
      ? legacyToBagelIllustration[input.tone as BagelTone]
      : { base: "golden" as BagelBase, topping: "none" as BagelTopping };

  return {
    base: baseValues.has(input.base as BagelBase)
      ? (input.base as BagelBase)
      : legacy.base,
    topping: toppingValues.has(input.topping as BagelTopping)
      ? (input.topping as BagelTopping)
      : legacy.topping,
  };
}

export type BagelBaseColors = {
  /** グラデーション：明るい部分 → 中間 → 濃い部分 */
  hi: string;
  mid: string;
  deep: string;
  /** 上部のツヤ */
  shine: string;
  /** 下部の焼き色の縁 */
  edge: string;
};

/**
 * ベース色ごとの色味。ネイビー×クリームの世界観に合う、くすみのある落ち着いた色に揃える。
 * golden / cheese / chocolate / seasonal は旧 BagelGraphic の色をそのまま引き継ぐ。
 */
export const bagelBaseColors: Record<BagelBase, BagelBaseColors> = {
  plain: { hi: "#f1dcba", mid: "#e0b382", deep: "#c69a67", shine: "#f8ecd4", edge: "#ad8355" },
  golden: { hi: "#e9be83", mid: "#d3914a", deep: "#b97945", shine: "#f2d5ac", edge: "#9c6136" },
  whole_wheat: { hi: "#d2ab7d", mid: "#a87c50", deep: "#8a6442", shine: "#e3c8a2", edge: "#73543a" },
  cheese: { hi: "#f0cc7e", mid: "#dfa852", deep: "#c08a3e", shine: "#f7e2af", edge: "#a9772f" },
  chocolate: { hi: "#b98a64", mid: "#96603c", deep: "#7a4c2e", shine: "#d0a886", edge: "#6b4128" },
  matcha: { hi: "#bcc793", mid: "#93a468", deep: "#788a54", shine: "#d8dfb6", edge: "#66774a" },
  berry: { hi: "#dda19a", mid: "#bc6f72", deep: "#9e575c", shine: "#eec4bd", edge: "#88484d" },
  pumpkin: { hi: "#f0b571", mid: "#dd8d3e", deep: "#ba7031", shine: "#f6d5a4", edge: "#9d5f29" },
  seasonal: { hi: "#e8a783", mid: "#cf7e52", deep: "#b0623c", shine: "#f2c7ac", edge: "#995434" },
};
