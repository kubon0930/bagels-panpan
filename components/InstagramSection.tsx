import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
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
 * Instagram投稿の仮カードセクション。
 * TODO: 実際の投稿埋め込み（embed）や写真に差し替える場合はこのカード部分を置き換えてください。
 */
export default function InstagramSection() {
  return (
    <section id="instagram">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <SectionHeading
          eyebrow="Instagram / News"
          title={<span className="font-display">Latest from Instagram</span>}
          description={
            <>
              営業日、臨時休業、焼き上がり情報は
              <br className="sm:hidden" />
              Instagramでいちばん早くお知らせしています。
            </>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {instagramCards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 100}>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-card border border-wheat/70 bg-gradient-to-br from-milk to-wheat/60 p-6 text-center shadow-warm transition-all hover:-translate-y-1 hover:shadow-warm-lg"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft/90 text-crust transition-colors group-hover:bg-crust group-hover:text-cream">
                  <InstagramIcon className="h-7 w-7" />
                </span>
                <span className="font-bold tracking-wide">{card.title}</span>
                <span className="text-xs leading-relaxed text-cocoa/65">
                  {card.caption}
                </span>
                <span className="sr-only">（Instagramを新しいタブで開きます）</span>
              </a>
            </FadeIn>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-crust px-10 py-3.5 font-medium text-cream shadow-warm transition-all hover:-translate-y-0.5 hover:bg-cocoa"
          >
            <InstagramIcon className="h-5 w-5" />
            Instagramで最新情報を見る
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </div>
      </div>
    </section>
  );
}
