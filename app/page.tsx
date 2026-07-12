import Access from "@/components/Access";
import BeforeVisit from "@/components/BeforeVisit";
import Concept from "@/components/Concept";
import FadeIn from "@/components/FadeIn";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowToVisit from "@/components/HowToVisit";
import InstagramSection from "@/components/InstagramSection";
import Lineup from "@/components/Lineup";
import MobileCta from "@/components/MobileCta";
import {
  businessHours,
  shopInfo,
  siteUrl,
  socialLinks,
} from "@/data/site";

// ラインナップは管理画面で編集できるため、最大60秒ごとにページを再生成して反映する。
export const revalidate = 60;

/**
 * LocalBusiness(Bakery) の構造化データ。
 * 閉店時刻は「売り切れ次第」で不確かなため記載せず、
 * 確実な情報（開店時刻・営業曜日）のみを記載する。
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: shopInfo.name,
  description: `${shopInfo.name}は、東京都板橋区・中板橋にある手づくりベーグル専門店です。営業は${businessHours.oneLine}（売り切れ次第終了）。オープン時間は変更となる場合があります。`,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "東京都",
    addressLocality: "板橋区",
    streetAddress: "常盤台1-61-6",
  },
  servesCuisine: "ベーグル",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Friday", "Saturday"],
      opens: "12:00",
    },
  ],
  sameAs: [socialLinks.instagram, socialLinks.tabelog],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/*
        キーボード操作用のスキップリンク。
        表示条件は globals.css の .skip-link で管理
        （pointer: fine の環境で Tab フォーカスされたときだけ表示。
        iOS Safari がページ遷移時のプログラム的フォーカスで
        誤表示してしまうのを防ぐため、タッチ端末では常に非表示）。
      */}
      <a href="#main" className="skip-link">
        本文へスキップ
      </a>
      <Header />
      <main id="main">
        <Hero />
        <BeforeVisit />
        <FadeIn>
          <Concept />
        </FadeIn>
        <FadeIn>
          <Lineup />
        </FadeIn>
        <FadeIn>
          <Features />
        </FadeIn>
        <FadeIn>
          <HowToVisit />
        </FadeIn>
        <FadeIn>
          <Access />
        </FadeIn>
        <FadeIn>
          <InstagramSection />
        </FadeIn>
        <FadeIn>
          <FAQ />
        </FadeIn>
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
