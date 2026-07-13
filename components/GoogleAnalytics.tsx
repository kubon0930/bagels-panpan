"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID, gaEnabled } from "@/lib/analytics";

/**
 * GA4（Google tag）の読み込み。本番環境かつ Measurement ID 設定時のみ描画。
 * ページビューは SPA 遷移も含めて AnalyticsPageView から手動送信するため、
 * config では send_page_view を無効にして二重計測を防ぐ。
 */
export default function GoogleAnalytics() {
  if (!gaEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
