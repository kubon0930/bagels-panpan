"use client";

import BagelIllustration from "@/components/BagelIllustration";
import {
  bagelBaseOptions,
  bagelToppingOptions,
  type BagelIllustrationSpec,
} from "@/lib/bagel-illustration";

/**
 * ベース色×トッピングをピルで選ぶピッカー（プレビューつき）。
 * 管理画面のラインナップ編集・販売商品編集で共通利用する。
 */
export default function IllustrationPicker({
  value,
  onChange,
}: {
  value: BagelIllustrationSpec;
  onChange: (next: BagelIllustrationSpec) => void;
}) {
  const pillClass = (selected: boolean) =>
    `flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${
      selected
        ? "border-navy bg-navy/5 text-navy"
        : "border-line bg-warm text-ink/70 hover:border-navy/40"
    }`;

  return (
    <div className="rounded-xl border border-line bg-cream p-3">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink/70">ベース色</p>
            <div className="flex flex-wrap gap-1.5">
              {bagelBaseOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onChange({ ...value, base: o.value })}
                  aria-pressed={value.base === o.value}
                  className={pillClass(value.base === o.value)}
                >
                  <BagelIllustration
                    base={o.value}
                    topping="none"
                    holeColor="var(--color-warm)"
                    className="h-5 w-5 shrink-0"
                  />
                  <span className="whitespace-nowrap">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink/70">トッピング</p>
            <div className="flex flex-wrap gap-1.5">
              {bagelToppingOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onChange({ ...value, topping: o.value })}
                  aria-pressed={value.topping === o.value}
                  className={pillClass(value.topping === o.value)}
                >
                  <BagelIllustration
                    base={value.base}
                    topping={o.value}
                    holeColor="var(--color-warm)"
                    className="h-5 w-5 shrink-0"
                  />
                  <span className="whitespace-nowrap">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* プレビュー */}
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-warm px-4 py-3">
          <BagelIllustration
            base={value.base}
            topping={value.topping}
            holeColor="var(--color-warm)"
            className="h-16 w-16"
          />
          <p className="text-[10px] text-ink/50">プレビュー</p>
        </div>
      </div>
    </div>
  );
}
