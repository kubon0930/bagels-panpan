"use client";

import { useState } from "react";
import BagelGraphic from "@/components/BagelGraphic";
import { shopInfo, socialLinks } from "@/data/site";

const navItems = [
  { label: "Concept", href: "#concept" },
  { label: "Menu", href: "#menu" },
  { label: "Access", href: "#access" },
  { label: "Instagram", href: "#instagram" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-wheat/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 md:h-20">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-wide text-cocoa transition-colors hover:text-crust md:text-xl"
        >
          <BagelGraphic className="h-6 w-6 shrink-0" holeColor="var(--color-cream)" />
          {shopInfo.name}
        </a>

        {/* PCナビゲーション */}
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-sm font-semibold tracking-wider text-cocoa/80 transition-colors hover:text-crust"
            >
              {item.label}
            </a>
          ))}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-crust/50 px-5 py-2 text-sm font-medium text-crust transition-all hover:-translate-y-0.5 hover:bg-crust hover:text-cream"
          >
            Instagramを見る
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </nav>

        {/* モバイル：ハンバーガーボタン */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-milk md:hidden"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-cocoa transition-transform duration-300 ${
              menuOpen ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-cocoa transition-transform duration-300 ${
              menuOpen ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

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
          className={`min-h-0 overflow-hidden bg-cream transition-[visibility] duration-300 ${
            menuOpen ? "visible" : "invisible"
          }`}
        >
          <div className="border-t border-wheat/70 px-5 pb-6 pt-2">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-wheat/60 py-3.5 font-display font-semibold tracking-wider text-cocoa/85"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-5 block rounded-full bg-crust py-3 text-center font-medium text-cream transition-colors hover:bg-cocoa"
            >
              Instagramを見る
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
