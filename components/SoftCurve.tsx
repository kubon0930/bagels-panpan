type SoftCurveProps = {
  /** true にすると上下反転（セクションの下端用） */
  flip?: boolean;
  className?: string;
};

/**
 * セクション区切りの柔らかい曲線。
 * bg-milk のセクションの上下に置いて、クリーム背景となめらかにつなぐ。
 */
export default function SoftCurve({ flip = false, className = "" }: SoftCurveProps) {
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-6 w-full text-milk md:h-10 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 40V24C180 8 400 0 720 6s560 20 720 8v26H0Z"
      />
    </svg>
  );
}
