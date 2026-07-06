import Image from "next/image";
import BagelGraphic from "@/components/BagelGraphic";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { menuItems, menuPriceNote, socialLinks } from "@/data/site";

export default function Menu() {
  return (
    <section id="menu">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <SectionHeading
          eyebrow="Menu"
          title={<span className="font-display">Menu</span>}
          description={
            <>
              定番から季節の味まで、
              <br className="hidden sm:block" />
              その日焼き上がるベーグルをお楽しみください。
            </>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <FadeIn key={item.name} delay={index * 80} className="h-full">
              <article className="group h-full rounded-card border border-wheat/70 bg-soft p-5 shadow-warm transition-all hover:-translate-y-1 hover:shadow-warm-lg">
                {/*
                  商品写真エリア。
                  data/site.ts の menuItems に image を設定すると写真表示に切り替わります。
                */}
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-milk">
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
                      holeColor="var(--color-milk)"
                      tone={item.tone}
                    />
                  )}
                  {item.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-toast px-3 py-1 font-display text-xs font-semibold tracking-wider text-white">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="space-y-2 px-1 pb-1 pt-5">
                  <h3 className="font-display text-lg font-bold tracking-wide">
                    {item.name}
                    {item.nameJa && (
                      <span className="ml-2 align-middle text-xs font-medium text-cocoa/65">
                        {item.nameJa}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-cocoa/80">
                    {item.description}
                  </p>
                  <p className="pt-1 text-xs text-cocoa/70">{menuPriceNote}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-wheat bg-milk/70 px-6 py-5 text-center text-sm leading-relaxed text-cocoa/80">
          商品内容は日によって変わる場合があります。
          <br />
          最新の焼き上がり情報は
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 font-medium text-crust underline underline-offset-4 transition-colors hover:text-toast"
          >
            Instagram
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
          をご確認ください。
        </div>
      </div>
    </section>
  );
}
