import type { Metadata } from "next";
import Link from "next/link";
import ReserveHeader from "@/components/reserve/ReserveHeader";
import { cancelPolicy, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "予約について｜Bagels Panpan.",
  robots: { index: false },
};

/**
 * Stripe決済のキャンセル時の戻り先、または予約キャンセルの案内ページ。
 * 決済を中断した場合、注文は決済期限切れ（30分）で自動的に在庫が戻ります。
 */
export default function ReserveCancelPage() {
  return (
    <div className="min-h-screen bg-warm text-ink">
      <ReserveHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-12 sm:px-8">
        <h1 className="text-2xl font-bold tracking-wide text-navy">
          決済が完了しませんでした
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">
          お支払いが完了しなかったため、ご予約は確定していません。
          もう一度お試しいただくか、店頭でのご購入をご検討ください。
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          ※ 確保していた商品は、しばらくすると自動的に予約可能な状態に戻ります。
        </p>

        <div className="mt-8 rounded-card border border-line bg-cream p-6">
          <h2 className="text-sm font-bold text-bagel">
            キャンセル・変更について
          </h2>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
            {cancelPolicy.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/reserve"
            className="w-full rounded-full bg-navy px-8 py-3.5 text-center font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep sm:w-auto"
          >
            もう一度予約する
          </Link>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-navy/30 px-8 py-3.5 text-center font-medium text-navy transition-colors hover:bg-navy hover:text-paper sm:w-auto"
          >
            Instagramで問い合わせる
          </a>
        </div>
      </main>
    </div>
  );
}
