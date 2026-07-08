import type { Metadata } from "next";
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

      <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10 sm:px-8">
        {/* 冒頭の説明 */}
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-bagel">
            Reservation
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-wide text-navy sm:text-3xl">
            予約販売
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-loose text-ink/80">
            開店前の混雑を少しでも減らし、暑い日でも安心してお受け取りいただけるよう、
            販売日の一部商品を事前予約でご用意しています。
          </p>
        </div>

        <ReserveNotesBox className="mt-8" />

        {/* 販売日が無い / 準備中 / 通常表示 の出し分け */}
        {days === null ? (
          <EmptyState
            title="予約販売は準備中です"
            body="ただいま予約販売の準備を進めています。最新情報はInstagramをご確認ください。"
          />
        ) : days.length === 0 ? (
          <EmptyState
            title="現在受付中の予約販売はありません"
            body="次回の予約販売が決まりましたら、Instagramでお知らせします。"
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
    <div className="mt-10 rounded-card border border-line bg-cream px-6 py-12 text-center">
      <p className="text-lg font-bold text-navy">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/75">
        {body}
      </p>
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-navy px-8 py-3 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
      >
        Instagramで最新情報を見る
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    </div>
  );
}
