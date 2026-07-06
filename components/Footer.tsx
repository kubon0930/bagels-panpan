import BagelGraphic from "@/components/BagelGraphic";
import { businessHours, shopInfo, socialLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      {/* モバイルは下部固定CTAと重ならないよう余白を多めに取る */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-14 sm:px-8 md:pb-16 md:pt-16">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="space-y-3">
            <p className="flex items-center justify-center gap-2.5 font-display text-2xl font-bold tracking-wide md:justify-start">
              <BagelGraphic
                className="h-7 w-7 shrink-0"
                holeColor="var(--color-espresso)"
              />
              {shopInfo.name}
            </p>
            <p className="text-sm text-cream/80">{shopInfo.brandCopy}</p>
          </div>

          <div className="space-y-2 text-sm leading-relaxed text-cream/80">
            <p>{shopInfo.address}</p>
            <p>{shopInfo.access}</p>
            <p>{businessHours.oneLine}</p>
            <p className="text-cream/60">
              定休日：{businessHours.closedDaysShort}（臨時休業あり）
            </p>
            <p className="text-cream/60">{businessHours.instagramNote}</p>
          </div>

          <nav aria-label="外部リンク" className="flex flex-col gap-3 text-sm">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/90 underline-offset-4 transition-colors hover:text-toast hover:underline"
            >
              Instagram
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
            <a
              href={socialLinks.tabelog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/90 underline-offset-4 transition-colors hover:text-toast hover:underline"
            >
              食べログ
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </nav>
        </div>

        <p className="mt-12 border-t border-cream/15 pt-6 text-center text-xs text-cream/55">
          © 2026 Bagels Panpan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
