"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ReserveHeader from "@/components/reserve/ReserveHeader";
import { shopInfo, socialLinks } from "@/data/site";
import { yen } from "@/lib/format";
import {
  CART_STORAGE_KEY,
  LAST_ORDER_STORAGE_KEY,
  type LastOrderSummary,
} from "@/lib/reservation";

function CompleteInner() {
  const params = useSearchParams();
  const codeFromUrl = params.get("code");
  const [summary, setSummary] = useState<LastOrderSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);
      if (raw) setSummary(JSON.parse(raw) as LastOrderSummary);
      // 決済後の戻りではカートを掃除する
      sessionStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      /* noop */
    }
    setLoaded(true);
  }, []);

  const code = summary?.code ?? codeFromUrl ?? "";

  return (
    <div className="min-h-screen bg-warm text-ink">
      <ReserveHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-12 sm:px-8">
        {/* 完了メッセージ */}
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy text-paper">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-wide text-navy">
            ご予約ありがとうございます
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            ご予約を承りました。当日は店頭にて予約番号をお伝えください。
          </p>
        </div>

        {/* 予約番号 */}
        {code && (
          <div className="mx-auto mt-8 max-w-sm rounded-card border-2 border-navy/15 bg-cream px-6 py-6 text-center">
            <p className="text-xs font-medium text-bagel">予約番号</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-wider text-navy">
              {code}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/70">
              この予約番号のスクリーンショットを保存いただくか、お控えください。
              <br />
              （確認メールの送信はございません）
            </p>
          </div>
        )}

        {/* 予約内容（予約のみモードのみ手元にある） */}
        {summary && (
          <div className="mt-6 rounded-card border border-line bg-warm p-6 shadow-warm">
            <div className="space-y-1 text-sm">
              <Row label="受け取り日" value={summary.dayLabel} />
              <Row label="受け取り時間" value={summary.slotLabel} />
              <Row label="お支払い" value={summary.paymentLabel} />
            </div>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {summary.items.map((i) => (
                <li key={i.name} className="flex justify-between py-2 text-sm">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span className="font-medium">{yen(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-line pt-3 font-bold text-navy">
              <span>合計</span>
              <span>{yen(summary.total)}</span>
            </div>
          </div>
        )}

        {loaded && !summary && !code && (
          <p className="mt-8 text-center text-sm text-ink/70">
            予約情報の表示に失敗しました。ご予約はメールでもお送りしています。
          </p>
        )}

        {/* 注意事項 */}
        <div className="mt-6 rounded-card border border-line bg-cream p-6 text-sm leading-relaxed text-ink/80">
          <p className="font-bold text-navy">ご来店について</p>
          <ul className="mt-2 space-y-1.5">
            <li>・受け取り場所：{shopInfo.name}（{shopInfo.address}）</li>
            <li>・ネイビーの外観と白い看板が目印です。</li>
            <li>・オープン時間・受け取り時間は変更となる場合があります。</li>
            <li>
              ・最新情報は
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="mx-0.5 font-medium text-navy underline underline-offset-2">
                Instagram
              </a>
              をご確認ください。
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex rounded-full border border-navy/30 px-8 py-3 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-paper">
            公式サイトへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm" />}>
      <CompleteInner />
    </Suspense>
  );
}
