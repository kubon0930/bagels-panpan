"use client";

import { useEffect, useState } from "react";
import BagelGraphic from "@/components/BagelGraphic";
import ReservationLink from "@/components/ReservationLink";

/**
 * スマホ下部の予約販売への固定CTA（トップページ専用）。
 * Hero内の予約CTA（#hero-reserve-cta）が見えている間は非表示にして、
 * ファーストビューで予約ボタンが二重に見えないようにする。
 * ハンバーガーメニュー表示中（body[data-menu-open]）も非表示。
 */
export default function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-reserve-cta");
    if (heroCta && "IntersectionObserver" in window) {
      // 固定ヘッダー(64px)の裏に完全に隠れたら「画面外」とみなす
      const observer = new IntersectionObserver(
        ([entry]) => setShow(!entry.isIntersecting),
        { rootMargin: "-64px 0px 0px 0px" },
      );
      observer.observe(heroCta);
      return () => observer.disconnect();
    }
    // フォールバック：一定スクロール量で表示
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 transition-all duration-300 md:hidden [body[data-menu-open]_&]:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ReservationLink
        buttonLocation="floating"
        text="予約販売を見る"
        className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-paper/15 bg-navy-deep/95 py-2 pl-2.5 pr-5 shadow-warm backdrop-blur transition-colors hover:bg-navy"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper/10"
        >
          <BagelGraphic className="h-6 w-6" holeColor="var(--color-navy-deep)" />
        </span>
        <span className="whitespace-nowrap font-bold tracking-wide text-paper">
          予約販売を見る
        </span>
        <span aria-hidden="true" className="shrink-0 text-toast">
          →
        </span>
      </ReservationLink>
    </div>
  );
}
