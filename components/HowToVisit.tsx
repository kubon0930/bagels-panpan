import { Fragment } from "react";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { shopInfo, socialLinks } from "@/data/site";

const steps = [
  {
    number: "01",
    title: "Instagramで営業日を確認",
    description:
      "営業日、臨時休業、オープン時間、焼き上がり情報はInstagramでお知らせしています。",
  },
  {
    number: "02",
    title: "中板橋のネイビーのお店へ",
    description: `お店は${shopInfo.address}。中板橋駅から徒歩約2分です。`,
  },
  {
    number: "03",
    title: "店頭で選ぶ",
    description:
      "その日並ぶベーグルから、お好きなものをお選びください。売り切れ次第終了となります。",
  },
];

function StepArrow() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center py-1 text-toast md:w-10 md:py-0"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 rotate-90 md:rotate-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

export default function HowToVisit() {
  return (
    <section id="how-to-visit">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <SectionHeading
          eyebrow="How to visit"
          title={<span className="font-display">How to visit</span>}
          description="ご来店前にInstagramで最新情報をご確認ください。"
        />

        <div className="mt-12 flex flex-col items-stretch md:flex-row">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              {index > 0 && <StepArrow />}
              <div className="flex-1">
                <FadeIn delay={index * 100} className="h-full">
                  <div className="flex h-full flex-col items-center rounded-card border border-line bg-warm p-8 text-center shadow-warm">
                    <span className="font-display text-3xl font-bold text-toast">
                      {step.number}
                    </span>
                    <h3 className="mt-3 text-lg font-bold tracking-wide text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-navy px-10 py-3.5 font-medium text-paper shadow-warm transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
          >
            Instagramを見る
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </div>
      </div>
    </section>
  );
}
