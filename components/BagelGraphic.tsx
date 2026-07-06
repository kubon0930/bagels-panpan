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
  golden: { hi: "#f6c48d", mid: "#e8a15a", deep: "#c98a4b", shine: "#f9d9ae", edge: "#b9855a" },
  cheese: { hi: "#f8d189", mid: "#eeb254", deep: "#d3963d", shine: "#fbe3ae", edge: "#c08a36" },
  chocolate: { hi: "#c79a74", mid: "#a9714b", deep: "#8a5734", shine: "#d9b492", edge: "#7c4a2d" },
  seasonal: { hi: "#f2b295", mid: "#e08d62", deep: "#c06f47", shine: "#f7cdb4", edge: "#a95f3c" },
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
      <ellipse cx="58" cy="52" rx="4" ry="2.2" fill="#fff3e0" transform="rotate(-32 58 52)" />
      <ellipse cx="92" cy="36" rx="4" ry="2.2" fill="#fff3e0" transform="rotate(8 92 36)" />
      <ellipse cx="130" cy="42" rx="4" ry="2.2" fill="#fff3e0" transform="rotate(28 130 42)" />
      <ellipse cx="156" cy="72" rx="4" ry="2.2" fill="#fff3e0" transform="rotate(55 156 72)" />
      <ellipse cx="38" cy="88" rx="4" ry="2.2" fill="#fff3e0" transform="rotate(-68 38 88)" />
      <ellipse cx="70" cy="70" rx="3.4" ry="1.9" fill="#8a5c36" transform="rotate(-15 70 70)" />
      <ellipse cx="118" cy="60" rx="3.4" ry="1.9" fill="#8a5c36" transform="rotate(20 118 60)" />
      <ellipse cx="146" cy="104" rx="3.4" ry="1.9" fill="#8a5c36" transform="rotate(80 146 104)" />
    </svg>
  );
}
