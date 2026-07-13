import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import OutboundLink from "@/components/OutboundLink";
import { shopInfo, socialLinks } from "@/data/site";

/** 予約・法務ページ共通のシンプルなヘッダー（公式サイトへ戻る導線つき） */
export default function ReserveHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-warm/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-wide text-navy transition-colors hover:text-navy-soft"
        >
          <BrandLogo size={34} />
          <span className="whitespace-nowrap">{shopInfo.name}</span>
        </Link>
        <OutboundLink
          href={socialLinks.instagram}
          linkType="instagram"
          text="Instagram"
          className="rounded-full border border-navy/30 px-4 py-1.5 text-xs font-medium text-navy transition-all hover:bg-navy hover:text-paper sm:text-sm"
        >
          Instagram
          <span className="sr-only">（新しいタブで開きます）</span>
        </OutboundLink>
      </div>
    </header>
  );
}
