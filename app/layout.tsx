import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Noto_Sans_JP, Quicksand } from "next/font/google";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { brandImages, siteUrl } from "@/data/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#102050",
  // スマホ下部固定CTAの env(safe-area-inset-bottom) を有効にする
  viewportFit: "cover",
};

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// URLは data/site.ts の siteUrl で管理しています（独自ドメイン取得後はそちらを変更）。
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bagels Panpan.｜中板橋の手づくりベーグル専門店",
  description:
    "Bagels Panpan.は、東京都板橋区・中板橋にある手づくりベーグル専門店です。営業日は水・金・土、12:00から売り切れまで。オープン時間は変更となる場合があるため、最新情報はInstagramをご確認ください。",
  // 各ページの canonical URL（"./" は現在のパスに解決される）
  alternates: {
    canonical: "./",
  },
  // Google Search Console の所有権確認（未設定なら出力されない）
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  twitter: {
    card: "summary_large_image",
    title: "Bagels Panpan.｜中板橋の手づくりベーグル専門店",
    description:
      "もちっと香ばしいベーグルを、毎日の小さなしあわせに。東京都板橋区・中板橋のベーグル専門店です。",
    images: [brandImages.ogp],
  },
  openGraph: {
    title: "Bagels Panpan.｜中板橋の手づくりベーグル専門店",
    description:
      "もちっと香ばしいベーグルを、毎日の小さなしあわせに。東京都板橋区常盤台のベーグル専門店です。営業日・オープン時間の最新情報はInstagramをご確認ください。",
    type: "website",
    locale: "ja_JP",
    siteName: "Bagels Panpan.",
    // TODO: 実際のOGP画像（1200x630px）を public/images/ogp-placeholder.jpg に上書きすると差し替わります。
    images: [
      {
        url: brandImages.ogp,
        width: 1200,
        height: 630,
        alt: "Bagels Panpan.｜中板橋の手づくりベーグル専門店",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${quicksand.variable} antialiased`}
    >
      <body className="min-h-screen bg-warm text-ink">
        {children}
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <AnalyticsPageView />
        </Suspense>
      </body>
    </html>
  );
}
