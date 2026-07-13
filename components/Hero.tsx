import Image from "next/image";
import BagelGraphic from "@/components/BagelGraphic";
import BrandLogo from "@/components/BrandLogo";
import OutboundLink from "@/components/OutboundLink";
import ReservationLink from "@/components/ReservationLink";
import {
  brandImages,
  businessHours,
  heroBadges,
  shopInfo,
  socialLinks,
} from "@/data/site";
import { publicImageExists } from "@/lib/images";

/**
 * ベーグルの穴に丸型ロゴが「はまった」ブランドビジュアル。
 * 穴の色を背景に合わせ、内側に落ちる影でロゴが奥にあるような一体感を出す。
 */
function BagelLogoVisual({
  className = "",
  logoSize = 60,
  holeColor = "var(--color-navy-deep)",
}: {
  className?: string;
  logoSize?: number;
  holeColor?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <BagelGraphic className="h-full w-full" holeColor={holeColor} />
      {/* 穴の内側に落ちる影（ロゴがシールに見えないよう奥行きを付ける） */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[33%] w-[33%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_0_5px_12px_rgb(0_0_0/0.35)]"
      />
      <BrandLogo
        size={logoSize}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_4px_14px_-4px_rgb(0_0_0/0.55)]"
      />
    </div>
  );
}

/**
 * 店舗外観写真がまだない場合の代替ビジュアル（PC・タブレット用）。
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
      <div className="animate-float-slow">
        <BagelLogoVisual
          className="h-48 w-48"
          logoSize={48}
          holeColor="var(--color-navy-storefront)"
        />
      </div>
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

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-16 pt-24 sm:px-8 md:pb-28 md:pt-44 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-center md:space-y-8 lg:text-left">
          <p className="flex items-center justify-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-toast sm:text-sm lg:justify-start">
            <span aria-hidden="true" className="h-px w-6 bg-toast/50 md:hidden" />
            <span className="whitespace-nowrap">Handmade Bagel Shop</span>
            <span aria-hidden="true" className="h-px w-6 bg-toast/50 md:hidden" />
          </p>

          <h1 className="text-[1.45rem] font-bold leading-[1.7] tracking-wide [text-wrap:balance] [word-break:keep-all] sm:text-4xl sm:leading-[1.6] md:text-5xl md:leading-[1.55]">
            中板橋で、今日も
            <br />
            もちっと焼き上げています。
          </h1>

          {/* サブコピー（スマホは短く、PCは従来どおり） */}
          <p className="leading-relaxed text-paper/85 md:hidden">
            中板橋の小さなネイビーベーグル専門店、
            <br />
            <span className="whitespace-nowrap">{shopInfo.name}</span>です。
          </p>
          <p className="hidden leading-loose text-paper/85 md:block">
            {shopInfo.name}は、東京都板橋区・中板橋にある
            <br className="hidden sm:block" />
            ネイビーの小さなベーグル専門店です。
          </p>

          {/* スマホ用メインビジュアル：ベーグルの穴に丸型ロゴ */}
          <div className="pb-2 pt-1 md:hidden">
            <div className="relative mx-auto w-fit">
              {/* 接地影（ふわふわ揺れても地面に残る） */}
              <div
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 h-5 w-44 -translate-x-1/2 rounded-full bg-navy-deep/70 blur-md"
              />
              <div className="animate-float-slow">
                <BagelLogoVisual className="h-52 w-52 sm:h-60 sm:w-60" logoSize={56} />
              </div>
            </div>
          </div>

          {/* 小さな情報バッジ（PCのみ。スマホは下の1行表記に整理） */}
          <ul
            className="hidden flex-wrap justify-center gap-2 md:flex lg:justify-start"
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

          {/* スマホCTA：予約導線を主役に、Instagramは控えめに */}
          <div className="mx-auto max-w-sm space-y-3 md:hidden">
            <ReservationLink
              id="hero-reserve-cta"
              buttonLocation="hero"
              text="予約販売を見る"
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-toast px-6 py-3.5 font-bold text-navy-deep shadow-warm transition-colors hover:bg-paper"
            >
              予約販売を見る
              <span aria-hidden="true">→</span>
            </ReservationLink>
            <OutboundLink
              href={socialLinks.instagram}
              linkType="instagram"
              text="Instagramで営業日を見る"
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-paper/40 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-navy"
            >
              Instagramで営業日を見る
              <span aria-hidden="true">→</span>
            </OutboundLink>
            <p className="pt-1">
              <span className="inline-block whitespace-nowrap rounded-full border border-paper/20 bg-paper/10 px-4 py-1.5 text-[13px] tracking-wide text-paper/90">
                {businessHours.oneLine}
              </span>
            </p>
          </div>

          {/* PC CTA（従来どおり） */}
          <div className="hidden flex-col items-center gap-4 sm:flex-row sm:justify-center md:flex lg:justify-start">
            <a
              href="#lineup"
              className="w-full whitespace-nowrap rounded-full bg-toast px-8 py-3.5 text-center font-bold text-navy-deep shadow-warm transition-all hover:-translate-y-0.5 hover:bg-paper sm:w-auto"
            >
              ラインナップを見る
            </a>
            <OutboundLink
              href={socialLinks.instagram}
              linkType="instagram"
              text="Instagramで営業日を見る"
              className="w-full whitespace-nowrap rounded-full border border-paper/40 px-8 py-3.5 text-center font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-paper hover:text-navy sm:w-auto"
            >
              Instagramで営業日を見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </OutboundLink>
          </div>

          {/* 営業情報ミニカード（PCのみ） */}
          <div className="hidden rounded-2xl border border-paper/20 bg-paper/10 px-6 py-4 text-left text-sm leading-relaxed backdrop-blur-sm md:inline-block">
            <p className="font-bold">{businessHours.oneLine}</p>
            <p className="text-paper/80">
              売り切れ次第終了｜{shopInfo.access}
            </p>
            <p className="text-paper/80">
              オープン時間は変更となる場合があります。
              <br className="hidden sm:block" />
              最新情報は
              <OutboundLink
                href={socialLinks.instagram}
                linkType="instagram"
                text="Instagram"
                className="mx-0.5 font-medium text-toast underline underline-offset-4 transition-colors hover:text-paper"
              >
                Instagram
                <span className="sr-only">（新しいタブで開きます）</span>
              </OutboundLink>
              にてお知らせしています。
            </p>
          </div>

          {/* 予約販売への導線（PCのみ。スマホはHero CTAと追従CTAに集約） */}
          <ReservationLink
            buttonLocation="hero_card"
            text="予約販売を見る"
            className="hidden rounded-2xl bg-paper px-6 py-4 text-left shadow-warm transition-all hover:-translate-y-0.5 md:block"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap font-bold text-navy">予約販売を見る</span>
              <span aria-hidden="true" className="text-navy">
                →
              </span>
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-ink/70">
              暑い日や混雑時も、事前予約でスムーズにお受け取りいただけます。
            </span>
          </ReservationLink>
        </div>

        {/*
          メインビジュアル（PC・タブレット用）。
          public/images/panpan-storefront.jpg（店舗外観写真）を置いて再ビルドすると
          自動で写真表示に切り替わります。それまでは実店舗風のプレースホルダーを表示。
          スマホではHero内のベーグル×ロゴが主役になるため表示しない。
        */}
        <div className="hidden md:block">
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
      </div>
    </section>
  );
}
