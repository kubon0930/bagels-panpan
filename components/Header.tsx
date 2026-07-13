"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import OutboundLink from "@/components/OutboundLink";
import ReservationLink from "@/components/ReservationLink";
import { shopInfo, socialLinks } from "@/data/site";

const navItems = [
  { label: "Concept", href: "#concept" },
  { label: "Lineup", href: "#lineup" },
  { label: "Access", href: "#access" },
  { label: "Instagram", href: "#instagram" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // メニュー表示中は背景スクロールを止め、下部追従CTAを非表示にする
  // （MobileCta 側が body[data-menu-open] を見て隠れる）
  useEffect(() => {
    if (menuOpen) {
      document.body.setAttribute("data-menu-open", "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("data-menu-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.removeAttribute("data-menu-open");
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line ${
        menuOpen ? "bg-warm" : "bg-warm/90 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 md:h-20">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-wide text-navy transition-colors hover:text-navy-soft md:text-xl"
        >
          <BrandLogo size={36} />
          <span className="whitespace-nowrap">{shopInfo.name}</span>
        </a>

        {/* PCナビゲーション */}
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-sm font-semibold tracking-wider text-ink/75 transition-colors hover:text-navy"
            >
              {item.label}
            </a>
          ))}
          <ReservationLink
            buttonLocation="header"
            text="予約する"
            className="rounded-full bg-toast px-5 py-2 text-sm font-bold text-navy-deep transition-all hover:-translate-y-0.5 hover:bg-navy hover:text-paper"
          >
            予約する
          </ReservationLink>
          <OutboundLink
            href={socialLinks.instagram}
            linkType="instagram"
            text="Instagramを見る"
            className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
          >
            Instagramを見る
            <span className="sr-only">（新しいタブで開きます）</span>
          </OutboundLink>
        </nav>

        {/* モバイル：ハンバーガーボタン */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-cream md:hidden"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-navy transition-transform duration-300 ${
              menuOpen ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-navy transition-transform duration-300 ${
              menuOpen ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/*
        メニュー表示中の背景スクリム。
        メニュー下の残り画面をうっすら暗くして境界を綺麗に見せる（タップで閉じる）。
        ヘッダーバー（h-16）には重ならないよう top-16 から敷く。
      */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-16 -z-10 bg-navy-deep/35 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* モバイルメニュー（grid-rows で高さをなめらかに開閉） */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav
          aria-label="モバイルナビゲーション"
          className={`min-h-0 overflow-hidden rounded-b-3xl bg-warm shadow-warm-lg transition-[visibility] duration-300 ${
            menuOpen ? "visible" : "invisible"
          }`}
        >
          <div className="border-t border-line px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-1">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-3.5 font-display font-semibold tracking-wider text-ink/85"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ReservationLink
              buttonLocation="menu"
              text="予約販売を見る"
              onClick={() => setMenuOpen(false)}
              className="mt-5 block whitespace-nowrap rounded-full bg-toast py-3 text-center font-bold text-navy-deep transition-colors hover:bg-navy hover:text-paper"
            >
              予約販売を見る
            </ReservationLink>
            <OutboundLink
              href={socialLinks.instagram}
              linkType="instagram"
              text="Instagramを見る"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block whitespace-nowrap rounded-full bg-navy py-3 text-center font-medium text-paper transition-colors hover:bg-navy-deep"
            >
              Instagramを見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </OutboundLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
