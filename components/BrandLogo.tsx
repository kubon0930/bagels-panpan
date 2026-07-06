"use client";

import Image from "next/image";
import { useState } from "react";
import { brandImages } from "@/data/site";

type BrandLogoProps = {
  /** 直径（px）。next/image の最適化サイズにも使う */
  size?: number;
  className?: string;
};

/**
 * Instagramアイコン風の丸いネイビーロゴ。
 * public/images/panpan-logo-circle.jpg を円形に表示し、
 * 画像が読み込めない場合は CSS で同じ見た目を再現する。
 */
export default function BrandLogo({ size = 48, className = "" }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-navy text-center font-display font-bold leading-[1.15] text-paper ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.19 }}
        aria-label="Bagels Panpan. logo"
        role="img"
      >
        Bagels
        <br />
        Panpan.
      </span>
    );
  }

  return (
    <Image
      src={brandImages.logo}
      alt="Bagels Panpan. logo"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
