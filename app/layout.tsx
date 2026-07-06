import type { Metadata } from "next";
import { Noto_Sans_JP, Quicksand } from "next/font/google";
import { siteUrl } from "@/data/site";
import "./globals.css";

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
    "Bagels Panpan.は、東京都板橋区・中板橋にある手づくりベーグル専門店です。営業日は火・水・金・土、11:00から売り切れまで。最新情報はInstagramをご確認ください。",
  openGraph: {
    title: "Bagels Panpan.｜中板橋の手づくりベーグル専門店",
    description:
      "もちっと香ばしいベーグルを、毎日の小さなしあわせに。東京都板橋区常盤台のベーグル専門店です。",
    type: "website",
    locale: "ja_JP",
    siteName: "Bagels Panpan.",
    // TODO: 実際のOGP画像（1200x630px）を public/images/og-image.png に置いて差し替えてください。
    images: [
      {
        url: "/images/og-image.png",
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
      <body className="min-h-screen bg-cream text-cocoa">{children}</body>
    </html>
  );
}
