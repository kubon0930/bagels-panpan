type SectionHeadingProps = {
  /** 見出しの上に添える小さな英字ラベル */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
};

/** 各セクション共通の見出しブロック */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} space-y-4`}>
      {eyebrow && (
        <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-bagel">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold leading-relaxed tracking-wide text-navy sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl leading-loose text-ink/75">
          {description}
        </p>
      )}
    </div>
  );
}
