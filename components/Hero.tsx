import Image from "next/image";
import Link from "next/link";
import BagelGraphic from "@/components/BagelGraphic";
import BrandLogo from "@/components/BrandLogo";
import {
  brandImages,
  businessHours,
  heroBadges,
  reservePath,
  shopInfo,
  socialLinks,
} from "@/data/site";
import { publicImageExists } from "@/lib/images";

/**
 * 店舗外観写真がまだない場合の代替ビジュアル。
 * 実店舗（ネイビーの外観・白いタペストリー・丸ロゴ）をCSSで再現する。
 */
function StorefrontPlaceholder() {
  return (
    <div className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-7 rounded-[2rem] border border-paper/15 bg-navy-storefront px-8 py-10 shadow-warm-lg">
      {/* 看板 */}
      <p className="w-full rounded-xl bg-navy-deep py-3 text-center font-display text-xl font-bold tracking-wide text-paper">
        Bagels Panpan.
      </p>
      {/* タペストリー風ラベル */}
      <p className="rounded-lg bg-paper px-6 py-2.5 font-display text-sm font-bold tracking-[0.2em] text-navy">
        HELLO BAGELS!
      </p>
      <BagelGraphic
        className="h-44 w-44 animate-float-slow"
        holeColor="var(--color-navy-storefront)"
      />
      <BrandLogo size={72} className="shadow-warm" />
    </div>
  );
}

export default function Hero() {
  // public/images/panpan-storefront.jpg を置いて再ビルドすると写真表示に切り替わります
  const hasStorefront = publicImageExists("images/panpan-storefront.jpg");

  return (
    <section
      id="top"
      className="on-navy relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-navy-storefront text-paper"
    >
      {/* 背景の装飾（ドット模様と大きな円） */}
      <div
        aria-hidden="true"
        className="dot-pattern absolute inset-x-0 top-0 h-[26rem] text-paper opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-navy-soft/30"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-toast/15"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-44 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-center lg:text-left">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-toast sm:text-sm">
            Handmade Bagel Shop
          </p>

          <h1 className="text-[1.55rem] font-bold leading-[1.7] tracking-wide sm:text-4xl sm:leading-[1.6] md:text-5xl md:leading-[1.55]">
            中板橋で、今日も
            <br />
            もちっと焼き上げています。
          </h1>

          <p className="leading-loose text-paper/85">
            {shopInfo.name}は、東京都板橋区・中板橋にある
            <br className="hidden sm:block" />
            ネイビーの小さなベーグル専門店です。
          </p>

          {/* 小さな情報バッジ */}
          <ul
            className="flex flex-wrap justify-center gap-2 lg:justify-start"
            aria-label="お店の基本情報"
          >
            {heroBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-paper/25 bg-paper/10 px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-paper"
              >
                {badge}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#lineup"
              className="w-full rounded-full bg-toast px-8 py-3.5 text-center font-bold text-navy-deep shadow-warm transition-all hover:-translate-y-0.5 hover:bg-paper sm:w-auto"
            >
              ラインナップを見る
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-paper/40 px-8 py-3.5 text-center font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-paper hover:text-navy sm:w-auto"
            >
              Instagramで営業日を見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </div>

          {/* 営業情報ミニカード */}
          <div className="inline-block rounded-2xl border border-paper/20 bg-paper/10 px-6 py-4 text-left text-sm leading-relaxed backdrop-blur-sm">
            <p className="font-bold">{businessHours.oneLine}</p>
            <p className="text-paper/80">
              売り切れ次第終了｜{shopInfo.access}
            </p>
            <p className="text-paper/80">
              オープン時間は変更となる場合があります。
              <br className="hidden sm:block" />
              最新情報は
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0.5 font-medium text-toast underline underline-offset-4 transition-colors hover:text-paper"
              >
                Instagram
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
              にてお知らせしています。
            </p>
          </div>

          {/* 予約販売への導線 */}
          <Link
            href={reservePath}
            className="block rounded-2xl bg-paper px-6 py-4 text-left shadow-warm transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-bold text-navy">予約販売を見る</span>
              <span aria-hidden="true" className="text-navy">
                →
              </span>
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-ink/70">
              暑い日や混雑時も、事前予約でスムーズにお受け取りいただけます。
            </span>
          </Link>
        </div>

        {/*
          メインビジュアル。
          public/images/panpan-storefront.jpg（店舗外観写真）を置いて再ビルドすると
          自動で写真表示に切り替わります。それまでは実店舗風のプレースホルダーを表示。
        */}
        {hasStorefront ? (
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-paper/15 shadow-warm-lg">
              <Image
                src={brandImages.storefront}
                alt="Bagels Panpan. ネイビーの店舗外観"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 85vw"
                className="object-cover"
              />
            </div>
            <BrandLogo
              size={88}
              className="absolute -bottom-5 -left-5 border-4 border-navy-deep shadow-warm-lg"
            />
          </div>
        ) : (
          <StorefrontPlaceholder />
        )}
      </div>
    </section>
  );
}
