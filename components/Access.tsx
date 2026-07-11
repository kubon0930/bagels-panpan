import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import GoogleMap from "@/components/GoogleMap";
import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import {
  brandImages,
  businessHours,
  googleMapsUrl,
  openWeekDays,
  reservePath,
  shopInfo,
  socialLinks,
  weekDays,
} from "@/data/site";
import { publicImageExists } from "@/lib/images";

/** 優先度順：住所・アクセス → 営業情報 → 補足（予約・サービス・支払い） */
const accessRows: { label: string; value: React.ReactNode }[] = [
  { label: "店名", value: shopInfo.name },
  { label: "住所", value: shopInfo.address },
  { label: "最寄り", value: shopInfo.access },
  { label: "営業日", value: businessHours.openDaysShort },
  { label: "営業時間", value: `${businessHours.hours}（売り切れ次第終了）` },
  {
    label: "定休日",
    value: `${businessHours.closedDaysShort}（臨時休業あり）`,
  },
  { label: "取り置き", value: "通常の取り置きは行っていません" },
  {
    label: "予約販売",
    value: (
      <Link
        href={reservePath}
        className="font-medium text-navy underline underline-offset-4 transition-colors hover:text-bagel"
      >
        受付中の販売日は予約ページにて
      </Link>
    ),
  },
  { label: "サービス", value: shopInfo.services },
  { label: "支払い", value: shopInfo.payment },
  {
    label: "最新情報",
    value: (
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-navy underline underline-offset-4 transition-colors hover:text-bagel"
      >
        Instagramをご確認ください
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    ),
  },
];

/** 営業日をひと目で伝えるカレンダーチップ付きの営業情報カード */
function BusinessHoursCard() {
  const openSet = new Set<string>(openWeekDays);

  return (
    <div className="rounded-card bg-warm px-4 py-7 text-center shadow-warm sm:p-9">
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-bagel">
        Open
      </h3>

      {/* 曜日チップ */}
      <ul className="mt-5 flex flex-wrap justify-center gap-1.5 sm:gap-2" aria-label="営業日カレンダー">
        {weekDays.map((day) => {
          const isOpen = openSet.has(day);
          return (
            <li
              key={day}
              className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold sm:h-11 sm:w-11 sm:text-sm ${
                isOpen
                  ? "bg-navy text-paper shadow-warm"
                  : "bg-cream text-muted"
              }`}
            >
              {day}
              <span className="sr-only">{isOpen ? "曜日：営業" : "曜日：定休"}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink/75">
        ※ 祝日もお休みです（臨時休業あり）
      </p>

      <p className="mt-5 text-xl font-bold tracking-wide text-navy md:text-2xl">
        {businessHours.hours}
      </p>
      <p className="mt-3">
        <span className="inline-block rounded-2xl bg-toast/20 px-5 py-2 text-sm font-bold leading-relaxed text-ink/85">
          ひとつひとつ手づくりのため、売り切れ次第終了です
        </span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">
        オープン時間は変更となる場合があります。
        <br className="hidden sm:block" />
        営業日・臨時休業・焼き上がり情報は、随時
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-0.5 font-bold text-navy underline underline-offset-4 transition-colors hover:text-bagel"
        >
          Instagram
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
        にてお知らせします。
      </p>
    </div>
  );
}

/** 店舗外観写真（未配置の間はネイビーのプレースホルダー） */
function StorefrontPhoto() {
  // public/images/panpan-storefront.jpg を置いて再ビルドすると写真表示に切り替わります
  const hasStorefront = publicImageExists("images/panpan-storefront.jpg");

  if (!hasStorefront) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-3xl bg-navy-storefront p-8 text-center">
        <BrandLogo size={64} />
        <p className="rounded-lg bg-paper px-5 py-2 font-display text-xs font-bold tracking-[0.2em] text-navy">
          HELLO BAGELS!
        </p>
        <p className="text-sm leading-relaxed text-paper/85">
          {shopInfo.landmark}
        </p>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-3xl border border-line shadow-warm">
      <div className="relative aspect-[4/3]">
        <Image
          src={brandImages.storefront}
          alt="Bagels Panpan. ネイビーの店舗外観"
          fill
          sizes="(min-width: 1024px) 520px, 90vw"
          className="object-cover"
        />
      </div>
      <figcaption className="bg-warm px-5 py-3 text-center text-sm text-ink/80">
        {shopInfo.landmark}
      </figcaption>
    </figure>
  );
}

export default function Access() {
  return (
    <section id="access">
      <SoftCurve />
      <div className="bg-cream">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading eyebrow="Access" title={<span className="font-display">Access</span>} />

          <div className="mx-auto mt-12 max-w-3xl">
            <BusinessHoursCard />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* 店舗情報 */}
            <dl className="rounded-card bg-warm p-7 shadow-warm sm:p-9">
              {accessRows.map((row) => (
                <div
                  key={row.label}
                  className="flex gap-4 border-b border-line py-3.5 text-sm leading-relaxed last:border-b-0 sm:text-[15px]"
                >
                  <dt className="w-20 shrink-0 font-medium text-bagel">
                    {row.label}
                  </dt>
                  <dd className="flex-1 text-ink/90">{row.value}</dd>
                </div>
              ))}
            </dl>

            {/* 店舗外観・地図 */}
            <div className="flex flex-col gap-4">
              <StorefrontPhoto />
              <GoogleMap className="min-h-64 flex-1" />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-3 text-center text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="whitespace-nowrap">Google Mapで見る</span>
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <SoftCurve flip />
    </section>
  );
}
