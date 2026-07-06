import { useId } from "react";
import type { BagelTone } from "@/data/site";

type ToneColors = {
  /** グラデーション：明るい部分 → 中間 → 濃い部分 */
  hi: string;
  mid: string;
  deep: string;
  /** 上部のツヤ */
  shine: string;
  /** 下部の焼き色の縁 */
  edge: string;
};

const tones: Record<BagelTone, ToneColors> = {
  golden: { hi: "#e9be83", mid: "#d3914a", deep: "#b97945", shine: "#f2d5ac", edge: "#9c6136" },
  cheese: { hi: "#f0cc7e", mid: "#dfa852", deep: "#c08a3e", shine: "#f7e2af", edge: "#a9772f" },
  chocolate: { hi: "#b98a64", mid: "#96603c", deep: "#7a4c2e", shine: "#d0a886", edge: "#6b4128" },
  seasonal: { hi: "#e8a783", mid: "#cf7e52", deep: "#b0623c", shine: "#f2c7ac", edge: "#995434" },
};

type BagelGraphicProps = {
  className?: string;
  /** 中央の穴の色。置く場所の背景色に合わせると自然に見える */
  holeColor?: string;
  /** 焼き色のバリエーション */
  tone?: BagelTone;
};

/**
 * ベーグルを想起させる抽象的な円形グラフィック。
 * 写真が用意できるまでの仮ビジュアルとして Hero やメニューカードで使用。
 */
export default function BagelGraphic({
  className = "",
  holeColor = "var(--color-cream)",
  tone = "golden",
}: BagelGraphicProps) {
  const gradientId = useId();
  const c = tones[tone];

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="55%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.deep} />
        </radialGradient>
      </defs>

      {/* ベーグル本体 */}
      <circle cx="100" cy="100" r="88" fill={`url(#${gradientId})`} />
      {/* ふくらみのハイライト */}
      <path
        d="M 38 78 A 70 70 0 0 1 162 78"
        stroke={c.shine}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* 焼き色の濃い部分 */}
      <path
        d="M 46 140 A 72 72 0 0 0 154 140"
        stroke={c.edge}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      {/* 中央の穴 */}
      <circle cx="100" cy="100" r="33" fill={holeColor} />
      <circle
        cx="100"
        cy="100"
        r="33"
        fill="none"
        stroke={c.deep}
        strokeWidth="2"
        opacity="0.3"
      />

      {/* ごまの粒 */}
      <ellipse cx="58" cy="52" rx="4" ry="2.2" fill="#f9f0e0" transform="rotate(-32 58 52)" />
      <ellipse cx="92" cy="36" rx="4" ry="2.2" fill="#f9f0e0" transform="rotate(8 92 36)" />
      <ellipse cx="130" cy="42" rx="4" ry="2.2" fill="#f9f0e0" transform="rotate(28 130 42)" />
      <ellipse cx="156" cy="72" rx="4" ry="2.2" fill="#f9f0e0" transform="rotate(55 156 72)" />
      <ellipse cx="38" cy="88" rx="4" ry="2.2" fill="#f9f0e0" transform="rotate(-68 38 88)" />
      <ellipse cx="70" cy="70" rx="3.4" ry="1.9" fill="#7a4c2e" transform="rotate(-15 70 70)" />
      <ellipse cx="118" cy="60" rx="3.4" ry="1.9" fill="#7a4c2e" transform="rotate(20 118 60)" />
      <ellipse cx="146" cy="104" rx="3.4" ry="1.9" fill="#7a4c2e" transform="rotate(80 146 104)" />
    </svg>
  );
}
