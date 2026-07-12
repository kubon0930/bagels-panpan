import BrandLogo from "@/components/BrandLogo";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import { conceptScenes, shopInfo } from "@/data/site";

/* シーンカード用の小さな線画アイコン */

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 13h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-6Z" />
      <path d="M22 15h2a3 3 0 0 1 0 6h-2" />
      <path d="M11 9c0-1.4.9-1.9.9-3.3M16.5 9c0-1.4.9-1.9.9-3.3" />
    </svg>
  );
}

function LunchIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 20h22" />
      <path d="M8 20a8 8 0 0 1 16 0" />
      <path d="M13 9.5c.8-.8 2-.8 2.8 0M17 12c.8-.8 2-.8 2.8 0" />
      <path d="M7 24h18" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 12h14l-1.5 15h-11L9 12Z" />
      <path d="M12 12V9a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

const sceneIcons = [<LunchIcon key="l" />, <CoffeeIcon key="c" />, <GiftIcon key="g" />];

export default function Concept() {
  return (
    <section id="concept">
      <SoftCurve />
      <div className="bg-cream">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading
            eyebrow="Concept"
            title={
              <>
                ネイビーの小さなお店から、
                <br />
                焼きたてのしあわせを。
              </>
            }
          />

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-center leading-loose text-ink/85">
            <p>
              {shopInfo.name}は、中板橋の街にある小さなベーグル専門店です。
              <br />
              ネイビーの扉を開けると、その日焼き上がったベーグルが並びます。
            </p>
            <p>
              外は香ばしく、中はもちっと。
              <br />
              ランチにも、おうち時間にも、誰かへの手土産にも。
              <br />
              ひとつ食べるだけで、心もお腹も
              <span className="font-display font-semibold italic text-bagel">
                &ldquo;panpan&rdquo;
              </span>
              に満たされるようなベーグルを目指しています。
            </p>
          </div>

          {/* 毎日のシーン */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {conceptScenes.map((scene, index) => (
              <FadeIn key={scene.title} delay={index * 100}>
                <div className="flex h-full flex-col items-center gap-3 rounded-card bg-warm px-5 py-7 text-center shadow-warm">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-cream text-navy">
                    {sceneIcons[index]}
                  </span>
                  <h3 className="font-bold tracking-wide text-navy">
                    {scene.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/75">
                    {scene.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ブランドコピー */}
          <div className="mt-14 flex items-center justify-center gap-4">
            <BrandLogo size={44} className="shadow-warm" />
            <p className="font-display text-lg font-semibold tracking-wider text-navy md:text-xl">
              {shopInfo.brandCopy}
            </p>
          </div>
        </div>
      </div>
      <SoftCurve flip />
    </section>
  );
}
