import GoogleMap from "@/components/GoogleMap";
import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import {
  businessHours,
  googleMapsUrl,
  openWeekDays,
  shopInfo,
  socialLinks,
  weekDays,
} from "@/data/site";

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
  { label: "サービス", value: shopInfo.services },
  { label: "予約", value: "不可" },
  { label: "支払い", value: shopInfo.payment },
  {
    label: "最新情報",
    value: (
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-crust underline underline-offset-4 transition-colors hover:text-toast"
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
    <div className="rounded-card bg-soft px-4 py-7 text-center shadow-warm sm:p-9">
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-toast">
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
                  ? "bg-crust text-cream shadow-warm"
                  : "bg-wheat/50 text-cocoa/40"
              }`}
            >
              {day}
              <span className="sr-only">{isOpen ? "曜日：営業" : "曜日：定休"}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-cocoa/75">
        ※ 祝日はお休みです（臨時休業あり）
      </p>

      <p className="mt-5 text-xl font-bold tracking-wide md:text-2xl">
        {businessHours.hours}
      </p>
      <p className="mt-3">
        <span className="inline-block rounded-2xl bg-toast/20 px-5 py-2 text-sm font-bold leading-relaxed text-cocoa/85">
          ひとつひとつ手づくりのため、売り切れ次第終了です
        </span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-cocoa/75">
        {businessHours.cautionNote}
      </p>
    </div>
  );
}

export default function Access() {
  return (
    <section id="access">
      <SoftCurve />
      <div className="bg-milk">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading eyebrow="Access" title={<span className="font-display">Access</span>} />

          <div className="mx-auto mt-12 max-w-3xl">
            <BusinessHoursCard />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <dl className="rounded-card bg-soft p-7 shadow-warm sm:p-9">
              {accessRows.map((row) => (
                <div
                  key={row.label}
                  className="flex gap-4 border-b border-wheat/60 py-3.5 text-sm leading-relaxed last:border-b-0 sm:text-[15px]"
                >
                  <dt className="w-20 shrink-0 font-medium text-crust">
                    {row.label}
                  </dt>
                  <dd className="flex-1 text-cocoa/90">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-4">
              <GoogleMap className="min-h-72 flex-1 md:min-h-80" />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-crust/50 bg-soft px-8 py-3 text-center text-sm font-medium text-crust transition-all hover:-translate-y-0.5 hover:bg-crust hover:text-cream"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Google Mapで見る
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
