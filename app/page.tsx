import Access from "@/components/Access";
import Concept from "@/components/Concept";
import FadeIn from "@/components/FadeIn";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowToVisit from "@/components/HowToVisit";
import InstagramSection from "@/components/InstagramSection";
import Menu from "@/components/Menu";
import MobileCta from "@/components/MobileCta";
import {
  businessHours,
  shopInfo,
  siteUrl,
  socialLinks,
} from "@/data/site";

/**
 * LocalBusiness(Bakery) の構造化データ。
 * 営業終了時刻は「売り切れ次第」のため、確実な情報（開店時刻・営業曜日）のみを記載。
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: shopInfo.name,
  description: `${shopInfo.name}は、東京都板橋区・中板橋にある手づくりベーグル専門店です。営業は${businessHours.oneLine}（売り切れ次第終了）。`,
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
      dayOfWeek: ["Tuesday", "Wednesday", "Friday", "Saturday"],
      opens: "11:00",
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
      {/* キーボード操作用のスキップリンク（フォーカス時のみ表示） */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-crust focus:px-5 focus:py-2.5 focus:text-cream"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="main">
        <Hero />
        <FadeIn>
          <Concept />
        </FadeIn>
        <FadeIn>
          <Menu />
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
