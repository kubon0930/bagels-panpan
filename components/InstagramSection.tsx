import { instagramCards, socialLinks } from "@/data/site";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Instagram導線セクション。
 * 発信内容（焼き上がり・季節のベーグル・営業日）を1つのカードにまとめ、
 * リンクは末尾のCTAボタンに集約しています。
 * TODO: 実際の投稿埋め込み（embed）を入れる場合は、このカード内を差し替えてください。
 */
export default function InstagramSection() {
  return (
    <section id="instagram">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-card border border-wheat/70 bg-gradient-to-br from-milk to-wheat/50 px-6 py-12 text-center shadow-warm sm:px-12 sm:py-14">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-soft text-crust shadow-warm">
            <InstagramIcon className="h-8 w-8" />
          </span>

          <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.25em] text-crust">
            Instagram / News
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-wide sm:text-3xl">
            Latest from Instagram
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-loose text-cocoa/80">
            営業日、臨時休業、焼き上がり情報は、
            <br className="hidden sm:block" />
            Instagramでいちばん早くお知らせしています。
          </p>

          {/* 発信内容（リンクではなく情報として表示） */}
          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left sm:mt-9">
            {instagramCards.map((card) => (
              <li
                key={card.title}
                className="flex items-center gap-3 rounded-2xl bg-soft/80 px-4 py-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-milk text-crust">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="text-sm font-bold tracking-wide">
                    {card.title}
                  </span>
                  <span className="ml-2 text-xs text-cocoa/65">
                    {card.caption}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-crust px-10 py-3.5 font-medium text-cream shadow-warm transition-all hover:-translate-y-0.5 hover:bg-cocoa"
          >
            <InstagramIcon className="h-5 w-5" />
            Instagramで最新情報を見る
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>

          <p className="mt-5 text-xs text-cocoa/60">
            @bakery_panpan でお店の毎日を発信中
          </p>
        </div>
      </div>
    </section>
  );
}
