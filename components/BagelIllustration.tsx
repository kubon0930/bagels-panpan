import { useId } from "react";
import {
  bagelBaseColors,
  type BagelBase,
  type BagelTopping,
} from "@/lib/bagel-illustration";

type BagelIllustrationProps = {
  className?: string;
  /** 中央の穴の色。置く場所の背景色に合わせると自然に見える */
  holeColor?: string;
  /** 生地のベース色 */
  base?: BagelBase;
  /** 表面のトッピング */
  topping?: BagelTopping;
};

/** トッピング粒の共通ひな形（回転つき楕円） */
function Grain({
  x,
  y,
  r,
  fill,
  rx = 4,
  ry = 2.2,
  opacity,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
  rx?: number;
  ry?: number;
  opacity?: number;
}) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={rx}
      ry={ry}
      fill={fill}
      opacity={opacity}
      transform={`rotate(${r} ${x} ${y})`}
    />
  );
}

/**
 * トッピングの描画。ベーグルのリング上部（穴と外周の間）に、
 * 小さく上品に散らす。小サイズでも潰れないよう粒は少なめにする。
 */
function Topping({ topping, deep }: { topping: BagelTopping; deep: string }) {
  switch (topping) {
    case "none":
      return null;

    case "sesame":
      // 白ごま＋茶ごま（旧BagelGraphicの粒と同じ配置）
      return (
        <>
          <Grain x={58} y={52} r={-32} fill="#f9f0e0" />
          <Grain x={92} y={36} r={8} fill="#f9f0e0" />
          <Grain x={130} y={42} r={28} fill="#f9f0e0" />
          <Grain x={156} y={72} r={55} fill="#f9f0e0" />
          <Grain x={38} y={88} r={-68} fill="#f9f0e0" />
          <Grain x={70} y={70} r={-15} fill="#7a4c2e" rx={3.4} ry={1.9} />
          <Grain x={118} y={60} r={20} fill="#7a4c2e" rx={3.4} ry={1.9} />
          <Grain x={146} y={104} r={80} fill="#7a4c2e" rx={3.4} ry={1.9} />
        </>
      );

    case "black_sesame":
      return (
        <>
          <Grain x={58} y={52} r={-32} fill="#3d352c" rx={3.6} ry={2} />
          <Grain x={92} y={36} r={8} fill="#3d352c" rx={3.6} ry={2} />
          <Grain x={130} y={42} r={28} fill="#3d352c" rx={3.6} ry={2} />
          <Grain x={156} y={72} r={55} fill="#3d352c" rx={3.6} ry={2} />
          <Grain x={38} y={88} r={-68} fill="#3d352c" rx={3.6} ry={2} />
          <Grain x={70} y={70} r={-15} fill="#3d352c" rx={3.2} ry={1.8} />
          <Grain x={118} y={60} r={20} fill="#3d352c" rx={3.2} ry={1.8} />
          <Grain x={146} y={104} r={80} fill="#3d352c" rx={3.2} ry={1.8} />
        </>
      );

    case "cheese_crust":
      // 焼きチーズの溶けた濃淡（大きめの淡い塊＋濃い焼き目）
      return (
        <>
          <ellipse cx={72} cy={50} rx={13} ry={8} fill="#f2c14e" opacity={0.85} transform="rotate(-24 72 50)" />
          <ellipse cx={121} cy={42} rx={15} ry={9} fill="#f2c14e" opacity={0.85} transform="rotate(12 121 42)" />
          <ellipse cx={155} cy={84} rx={11} ry={8} fill="#f2c14e" opacity={0.85} transform="rotate(58 155 84)" />
          <ellipse cx={44} cy={82} rx={10} ry={7} fill="#f2c14e" opacity={0.8} transform="rotate(-62 44 82)" />
          <ellipse cx={78} cy={47} rx={4} ry={2.6} fill="#cf8f2a" opacity={0.9} transform="rotate(-24 78 47)" />
          <ellipse cx={128} cy={40} rx={4.5} ry={2.8} fill="#cf8f2a" opacity={0.9} transform="rotate(12 128 40)" />
          <ellipse cx={152} cy={90} rx={3.6} ry={2.4} fill="#cf8f2a" opacity={0.9} transform="rotate(58 152 90)" />
          <ellipse cx={99} cy={148} rx={9} ry={6} fill="#f2c14e" opacity={0.55} />
        </>
      );

    case "chocolate_chip":
      return (
        <>
          <circle cx={60} cy={56} r={4.6} fill="#4a2c1a" />
          <circle cx={96} cy={38} r={4.2} fill="#4a2c1a" />
          <circle cx={129} cy={47} r={4.6} fill="#4a2c1a" />
          <circle cx={154} cy={80} r={4.2} fill="#4a2c1a" />
          <circle cx={44} cy={86} r={4} fill="#4a2c1a" />
          <circle cx={112} cy={63} r={3.4} fill="#4a2c1a" />
          <circle cx={100} cy={150} r={3.8} fill="#4a2c1a" opacity={0.85} />
          {/* チップの小さなツヤ */}
          <circle cx={94.5} cy={36.5} r={1.1} fill="#8a5a3c" />
          <circle cx={127.5} cy={45.5} r={1.1} fill="#8a5a3c" />
        </>
      );

    case "cinnamon":
      // シナモンパウダーの細かな点と淡いライン
      return (
        <>
          <path
            d="M 52 62 A 62 62 0 0 1 148 62"
            stroke="#8a5530"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 14"
            fill="none"
            opacity={0.3}
          />
          <circle cx={62} cy={54} r={1.8} fill="#8a5530" opacity={0.75} />
          <circle cx={84} cy={42} r={1.5} fill="#8a5530" opacity={0.75} />
          <circle cx={104} cy={38} r={1.8} fill="#8a5530" opacity={0.75} />
          <circle cx={126} cy={44} r={1.5} fill="#8a5530" opacity={0.75} />
          <circle cx={146} cy={58} r={1.8} fill="#8a5530" opacity={0.75} />
          <circle cx={155} cy={92} r={1.5} fill="#8a5530" opacity={0.7} />
          <circle cx={44} cy={78} r={1.5} fill="#8a5530" opacity={0.7} />
          <circle cx={73} cy={62} r={1.2} fill="#8a5530" opacity={0.6} />
          <circle cx={116} cy={56} r={1.2} fill="#8a5530" opacity={0.6} />
        </>
      );

    case "sugar":
      // 白い粒と小さなきらめき
      return (
        <>
          <circle cx={60} cy={54} r={2.4} fill="#fffdf6" opacity={0.95} />
          <circle cx={90} cy={38} r={2} fill="#fffdf6" opacity={0.95} />
          <circle cx={122} cy={42} r={2.4} fill="#fffdf6" opacity={0.95} />
          <circle cx={150} cy={66} r={2} fill="#fffdf6" opacity={0.95} />
          <circle cx={44} cy={82} r={2} fill="#fffdf6" opacity={0.9} />
          <circle cx={108} cy={58} r={1.6} fill="#fffdf6" opacity={0.85} />
          <circle cx={156} cy={96} r={1.8} fill="#fffdf6" opacity={0.85} />
          <path d="M 76 48 h 7 M 79.5 44.5 v 7" stroke="#fffdf6" strokeWidth="1.6" strokeLinecap="round" opacity={0.95} />
          <path d="M 136 55 h 6 M 139 52 v 6" stroke="#fffdf6" strokeWidth="1.4" strokeLinecap="round" opacity={0.9} />
        </>
      );

    case "seeds":
      // 雑穀・シードのミックス
      return (
        <>
          <Grain x={56} y={56} r={-30} fill="#e6d5a3" rx={4.2} ry={2.4} />
          <Grain x={88} y={40} r={10} fill="#7a4c2e" rx={3.6} ry={2} />
          <Grain x={116} y={40} r={30} fill="#f9f0e0" />
          <Grain x={142} y={54} r={48} fill="#55483a" rx={3.2} ry={1.8} />
          <Grain x={156} y={84} r={66} fill="#e6d5a3" rx={4.2} ry={2.4} />
          <Grain x={42} y={80} r={-62} fill="#55483a" rx={3.2} ry={1.8} />
          <Grain x={70} y={66} r={-12} fill="#f9f0e0" rx={3.4} ry={1.9} />
          <Grain x={104} y={56} r={16} fill="#e6d5a3" rx={3.6} ry={2} />
          <Grain x={132} y={66} r={38} fill="#7a4c2e" rx={3.4} ry={1.9} />
          <Grain x={100} y={150} r={4} fill={deep} rx={3.4} ry={1.9} opacity={0.6} />
        </>
      );
  }
}

/**
 * ベーグルイラストの共通コンポーネント（ベース色 × トッピング）。
 * トップページLineup・管理画面プレビューなどで使用。
 * 旧 BagelGraphic はこのコンポーネントの互換ラッパー。
 */
export default function BagelIllustration({
  className = "",
  holeColor = "var(--color-cream)",
  base = "golden",
  topping = "none",
}: BagelIllustrationProps) {
  const gradientId = useId();
  const c = bagelBaseColors[base];

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

      {/* トッピング */}
      <Topping topping={topping} deep={c.deep} />
    </svg>
  );
}
