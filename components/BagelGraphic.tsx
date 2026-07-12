import BagelIllustration from "@/components/BagelIllustration";
import type { BagelTone } from "@/data/site";

type BagelGraphicProps = {
  className?: string;
  /** 中央の穴の色。置く場所の背景色に合わせると自然に見える */
  holeColor?: string;
  /** 焼き色のバリエーション（旧単一選択。新規実装では BagelIllustration を使用） */
  tone?: BagelTone;
};

/**
 * 旧来の装飾用ベーグルグラフィック（Hero・追従CTA・飾りなどで使用）。
 * 実体は BagelIllustration の互換ラッパーで、従来どおり
 * ごま付きの見た目を維持する（Heroのロゴ入りベーグルの世界観を変えないため）。
 */
export default function BagelGraphic({
  className = "",
  holeColor = "var(--color-cream)",
  tone = "golden",
}: BagelGraphicProps) {
  return (
    <BagelIllustration
      className={className}
      holeColor={holeColor}
      base={tone}
      topping="sesame"
    />
  );
}
