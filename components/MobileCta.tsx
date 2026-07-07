"use client";

import { useEffect, useState } from "react";
import { socialLinks } from "@/data/site";

/**
 * スマホ下部の Instagram 固定CTA。
 * Hero を通り過ぎたあたりからふわっと表示され、md 以上では表示しない。
 */
export default function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-5 transition-all duration-300 md:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-navy/95 px-7 py-3 text-sm font-medium text-paper shadow-warm-lg backdrop-blur transition-colors hover:bg-navy-deep"
      >
        Instagramで営業日を見る
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    </div>
  );
}
