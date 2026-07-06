import BagelGraphic from "@/components/BagelGraphic";
import { businessHours, heroBadges, shopInfo, socialLinks } from "@/data/site";

/** ベーグルから立ちのぼる湯気の細い線 */
function Steam() {
  return (
    <svg
      viewBox="0 0 64 44"
      className="h-9 w-14 text-crust/35"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 40c-4-6 4-9 0-15s4-9 0-15" opacity="0.7" />
      <path d="M32 42c-4-6 4-10 0-17s4-10 0-17" />
      <path d="M52 40c-4-6 4-9 0-15s4-9 0-15" opacity="0.7" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* 背景の装飾（ドット模様と大きな円） */}
      <div
        aria-hidden="true"
        className="dot-pattern absolute inset-x-0 top-0 h-[26rem] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-milk"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-wheat/50"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-44 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-center lg:text-left">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-crust sm:text-sm">
            Handmade Bagel Shop
          </p>

          <h1 className="text-[1.55rem] font-bold leading-[1.7] tracking-wide sm:text-4xl sm:leading-[1.6] md:text-5xl md:leading-[1.55]">
            中板橋で、今日も
            <br />
            もちっと焼き上げています。
          </h1>

          <p className="leading-loose text-cocoa/80">
            {shopInfo.name}は、東京都板橋区・中板橋にある
            <br className="hidden sm:block" />
            手づくりベーグルの小さなお店です。
          </p>

          {/* 小さな情報バッジ */}
          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="お店の基本情報">
            {heroBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-wheat bg-soft px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-crust"
              >
                {badge}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#menu"
              className="w-full rounded-full bg-crust px-8 py-3.5 text-center font-medium text-cream shadow-warm transition-all hover:-translate-y-0.5 hover:bg-cocoa sm:w-auto"
            >
              メニューを見る
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-crust/50 bg-soft/60 px-8 py-3.5 text-center font-medium text-crust transition-all hover:-translate-y-0.5 hover:bg-crust hover:text-cream sm:w-auto"
            >
              Instagramで営業日を見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </div>

          {/* 営業情報ミニカード */}
          <div className="inline-block rounded-2xl border border-wheat bg-milk/80 px-6 py-4 text-left text-sm leading-relaxed">
            <p className="font-medium">{businessHours.oneLine}</p>
            <p className="text-cocoa/70">
              売り切れ次第終了｜{shopInfo.access}
            </p>
            <p className="text-cocoa/70">
              最新情報は
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0.5 font-medium text-crust underline underline-offset-4 transition-colors hover:text-toast"
              >
                Instagram
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
              にてお知らせしています。
            </p>
          </div>
        </div>

        {/*
          メインビジュアル。
          TODO: ベーグルの写真が用意できたら、下の BagelGraphic を next/image に差し替えてください。
          例:
            <Image
              src="/images/hero.jpg"
              alt="Bagels Panpan. のベーグル"
              fill
              priority
              className="object-cover"
            />
          （public/images/hero.jpg に写真を置き、親の div はそのまま使えます）
        */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div aria-hidden="true" className="absolute -top-7 left-1/2 -translate-x-1/2">
            <Steam />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-full bg-milk shadow-[0_18px_50px_-20px_rgba(58,42,31,0.25)]">
            <BagelGraphic
              className="h-full w-full animate-float-slow p-10"
              holeColor="var(--color-milk)"
            />
          </div>
          {/* 小さな飾り円 */}
          <div
            aria-hidden="true"
            className="absolute -left-6 top-8 h-16 w-16 animate-float rounded-full bg-toast/70"
          />
          <div
            aria-hidden="true"
            className="absolute -right-4 bottom-12 h-10 w-10 animate-float rounded-full bg-wheat"
          />
        </div>
      </div>
    </section>
  );
}
