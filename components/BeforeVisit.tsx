import Link from "next/link";
import { businessHours, reservePath, socialLinks } from "@/data/site";

/**
 * Hero直下の「ご来店前に」カード。
 * 営業日・営業時間・Instagram確認の3点を、来店前チェックとして最初に伝える。
 */
export default function BeforeVisit() {
  return (
    <section id="before-visit" className="relative z-10">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto -mt-10 max-w-3xl rounded-card border-2 border-navy/15 bg-warm px-6 py-8 shadow-warm-lg sm:px-10">
          <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.25em] text-bagel">
            Before you visit
          </p>
          <h2 className="mt-2 text-center text-xl font-bold tracking-wide text-navy sm:text-2xl">
            ご来店前に
          </h2>

          <dl className="mx-auto mt-6 flex max-w-md flex-col gap-2.5">
            <div className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 sm:gap-4 sm:px-5">
              <dt className="w-16 shrink-0 text-sm font-medium text-bagel sm:w-20">
                営業日
              </dt>
              <dd className="font-bold tracking-wide text-navy">
                {businessHours.openDaysShort}
              </dd>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 sm:gap-4 sm:px-5">
              <dt className="w-16 shrink-0 text-sm font-medium text-bagel sm:w-20">
                営業時間
              </dt>
              <dd className="font-bold tracking-wide text-navy">
                {businessHours.hours}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-center text-sm leading-relaxed text-ink/75">
            オープン時間は変更となる場合があります。
            <br className="hidden sm:block" />
            最新情報は随時Instagramにてお知らせします。
          </p>

          {/* 予約販売の案内 */}
          <Link
            href={reservePath}
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-navy px-5 py-4 text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
          >
            <span className="text-sm leading-relaxed">
              <span className="font-bold">予約販売を見る</span>
              <br />
              <span className="text-paper/75">
                事前予約が可能な販売日は、予約ページにて受付状況をご確認ください。
              </span>
            </span>
            <span aria-hidden="true" className="shrink-0 text-toast">
              →
            </span>
          </Link>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-navy px-7 py-3 text-center text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep sm:w-auto"
            >
              Instagramで最新情報を見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
            <a
              href="#access"
              className="w-full rounded-full border border-navy/40 px-7 py-3 text-center text-sm font-medium text-navy transition-all hover:-translate-y-0.5 hover:bg-navy hover:text-paper sm:w-auto"
            >
              場所を見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
