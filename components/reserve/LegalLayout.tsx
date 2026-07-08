import Link from "next/link";
import ReserveHeader from "@/components/reserve/ReserveHeader";

/** 法務ページ共通レイアウト（本番公開前の確認注意つき） */
export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm text-ink">
      <ReserveHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-2xl font-bold tracking-wide text-navy">{title}</h1>

        {/* 公開前の確認注意（店舗責任者向け） */}
        <div className="mt-6 rounded-xl border border-bagel/40 bg-toast/10 px-5 py-4 text-sm leading-relaxed text-ink/80">
          <p className="font-bold text-bagel">※ 本番公開前に店舗責任者がご確認ください</p>
          <p className="mt-1">
            以下は仮の記載です。オンライン決済を有効にする前に、住所・販売責任者・
            問い合わせ先・販売価格・支払い方法・キャンセル/返金条件・個人情報の取り扱いを
            必ずご確認・修正してください。
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-loose text-ink/85">
          {children}
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <Link href="/" className="text-sm font-medium text-navy underline underline-offset-4">
            ← 公式サイトへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
