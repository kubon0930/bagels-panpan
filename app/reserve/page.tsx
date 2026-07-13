import type { Metadata } from "next";
import BagelGraphic from "@/components/BagelGraphic";
import OutboundLink from "@/components/OutboundLink";
import ReserveClient from "@/components/reserve/ReserveClient";
import ReserveHeader from "@/components/reserve/ReserveHeader";
import ReserveNotesBox from "@/components/reserve/ReserveNotesBox";
import { publicPaymentMode } from "@/lib/env";
import { loadReserveDays } from "@/lib/reserve-data";
import { socialLinks } from "@/data/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "予約販売｜Bagels Panpan.",
  description:
    "Bagels Panpan. の予約販売ページ。暑い日や混雑時も、事前予約でスムーズにお受け取りいただけます。販売日ごとに数量限定で受付しています。",
};

export default async function ReservePage() {
  const days = await loadReserveDays();
  const paymentMode = publicPaymentMode();

  return (
    <div className="min-h-screen bg-warm text-ink">
      <ReserveHeader />

      <main className="mx-auto w-full max-w-4xl px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-10 sm:px-8 sm:pb-24">
        {/* 冒頭の説明（スマホではコンパクトに見せる） */}
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-bagel">
            Reservation
          </p>
          <h1 className="mt-2 whitespace-nowrap text-2xl font-bold tracking-wide text-navy sm:text-3xl">
            予約販売
          </h1>
          <p className="mx-auto mt-3 max-w-[19rem] text-sm leading-loose text-ink/75 [text-wrap:balance] [word-break:keep-all] sm:mt-5 sm:max-w-xl sm:text-base">
            販売日ごとに数量限定で、
            <br className="sm:hidden" />
            ベーグルを事前予約できます。
            <br />
            暑い日や混雑時も、スムーズに受け取れます。
          </p>
          {/* トップページとつながる小さなベーグルの飾り */}
          <div aria-hidden="true" className="mt-4 flex justify-center sm:mt-5">
            <BagelGraphic className="h-7 w-7" holeColor="var(--color-warm)" />
          </div>
        </div>

        <ReserveNotesBox className="mt-6 sm:mt-8" />

        {/* 販売日が無い / 準備中 / 通常表示 の出し分け */}
        {days === null ? (
          <EmptyState
            title="予約販売は準備中です"
            body="ただいま予約販売の準備を進めています。最新情報はInstagramをご確認ください。"
          />
        ) : days.length === 0 ? (
          <EmptyState
            title="現在受付中の予約販売はありません"
            body="次回の販売日はInstagramでお知らせします。"
          />
        ) : (
          <ReserveClient days={days} paymentMode={paymentMode} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-8 rounded-card border border-line bg-cream px-6 py-10 text-center sm:mt-10 sm:py-12">
      <div aria-hidden="true" className="mb-4 flex justify-center">
        <BagelGraphic
          className="h-14 w-14 animate-float-slow"
          holeColor="var(--color-cream)"
        />
      </div>
      <p className="text-lg font-bold tracking-wide text-navy">{title}</p>
      <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-ink/75">
        {body}
      </p>
      <OutboundLink
        href={socialLinks.instagram}
        linkType="instagram"
        text="Instagramで最新情報を見る"
        className="mt-6 inline-flex whitespace-nowrap rounded-full bg-navy px-7 py-3 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
      >
        Instagramで最新情報を見る
        <span className="sr-only">（新しいタブで開きます）</span>
      </OutboundLink>
    </div>
  );
}
