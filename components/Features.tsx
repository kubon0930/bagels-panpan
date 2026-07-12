import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import { shopInfo } from "@/data/site";

/* 統一トーンの線画アイコン（ベーグル・麦・湯気と手のひら） */

function BagelIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="24" cy="24" r="17" />
      <circle cx="24" cy="24" r="6.5" />
      <path d="M13 14.5c1.5-1 3-1.5 4.5-1" />
      <path d="M30 11.5c1.5.3 3 1 4.2 2" />
    </svg>
  );
}

function WheatIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 42V14" />
      <path d="M24 20c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
      <path d="M24 20c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      <path d="M24 29c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
      <path d="M24 29c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      <path d="M24 14c0-3 1.5-5.5 4-7" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 33c4 5 10 8 16 8s12-3 16-8" />
      <path d="M12 33c3 3 7.5 5 12 5s9-2 12-5" opacity="0.45" />
      <path d="M20 12c0-2 1.3-3.5 2-4.5" />
      <path d="M27 12c0-2 1.3-3.5 2-4.5" />
      <path d="M16 24c2.5-2.5 6-4 8-4s5.5 1.5 8 4" />
    </svg>
  );
}

const features = [
  {
    icon: <BagelIcon />,
    title: "もちっと食感",
    description:
      "ひと口ごとに感じる、しっかりとした満足感。毎日食べても飽きない、やさしい美味しさを目指しています。",
  },
  {
    icon: <WheatIcon />,
    title: "毎日に合う味",
    description:
      "ランチ、おうち時間、手土産まで。日常のいろいろな場面に寄り添うベーグルです。",
  },
  {
    icon: <HandIcon />,
    title: "手づくりの温度",
    description:
      "ひとつひとつ丁寧に焼き上げる、小さなお店ならではの温かさ。売り切れ次第終了となる日もあります。",
  },
];

export default function Features() {
  return (
    <section id="features">
      <SoftCurve />
      <div className="bg-cream">
        <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 md:py-24">
          <SectionHeading
            eyebrow="Features"
            title={`${shopInfo.name}のこだわり`}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 100} className="h-full">
                <div className="h-full rounded-card bg-warm p-8 text-center shadow-warm transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                  <div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-cream text-navy">
                    {feature.icon}
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-toast font-display text-xs font-bold text-navy-deep"
                    >
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-navy">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <SoftCurve flip />
    </section>
  );
}
