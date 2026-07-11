import Link from "next/link";
import BagelGraphic from "@/components/BagelGraphic";
import { reservePath } from "@/data/site";

/**
 * スマホ下部の予約販売への固定CTA（トップページ専用）。
 * ファーストビューから常時表示し、md 以上では表示しない。
 * bottom は safe-area（ホームインジケータ等）を考慮して確保する。
 */
export default function MobileCta() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.875rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-5 md:hidden">
      <Link
        href={reservePath}
        className="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-full border border-paper/15 bg-navy-deep/95 py-2 pl-2.5 pr-5 shadow-warm-lg backdrop-blur transition-colors hover:bg-navy"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper/10"
        >
          <BagelGraphic className="h-6 w-6" holeColor="var(--color-navy-deep)" />
        </span>
        <span className="whitespace-nowrap font-bold tracking-wide text-paper">
          予約販売を見る
        </span>
        <span aria-hidden="true" className="shrink-0 text-toast">
          →
        </span>
      </Link>
    </div>
  );
}
