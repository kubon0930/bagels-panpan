import Image from "next/image";
import BagelGraphic from "@/components/BagelGraphic";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { menuItems, socialLinks } from "@/data/site";

/**
 * その日並ぶベーグルの紹介セクション。
 * 固定メニューではなくラインナップ例として見せる（内容は日によって変わる）。
 */
export default function Lineup() {
  return (
    <section id="lineup">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <SectionHeading
          eyebrow="Lineup"
          title="その日並ぶベーグル"
          description={
            <>
              その日並ぶベーグルは、焼き上がりや季節によって変わります。
              <br className="hidden sm:block" />
              最新のラインナップはInstagramでお知らせしています。
            </>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <FadeIn key={item.name} delay={index * 80} className="h-full">
              <article className="group h-full rounded-card border border-line bg-warm p-5 shadow-warm transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                {/*
                  商品写真エリア。
                  data/site.ts の menuItems に image を設定すると写真表示に切り替わります。
                */}
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-cream">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <BagelGraphic
                      className="h-28 w-28 transition-transform duration-500 group-hover:rotate-6 sm:h-32 sm:w-32"
                      holeColor="var(--color-cream)"
                      tone={item.tone}
                    />
                  )}
                  {item.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-toast px-3 py-1 font-display text-xs font-bold tracking-wider text-navy-deep">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="space-y-2 px-1 pb-1 pt-5">
                  <h3 className="font-display text-lg font-bold tracking-wide text-navy">
                    {item.name}
                    {item.nameJa && (
                      <span className="ml-2 align-middle rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-bagel">
                        {item.nameJa}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/80">
                    {item.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-line bg-cream px-6 py-5 text-center text-sm leading-relaxed text-ink/80">
          掲載している商品はラインナップ例です。
          <br />
          商品内容・価格は店頭または
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 font-medium text-navy underline underline-offset-4 transition-colors hover:text-bagel"
          >
            Instagram
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
          にてご確認ください。
        </div>
      </div>
    </section>
  );
}
