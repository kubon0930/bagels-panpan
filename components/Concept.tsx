import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import { conceptScenes, shopInfo } from "@/data/site";

/* シーンカード用の小さな線画アイコン */

function MorningIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="16" cy="18" r="6" />
      <path d="M16 6v3M6 18H3m26 0h-3M8.9 10.9 6.8 8.8m18.4 2.1 2.1-2.1" />
      <path d="M6 26h20" />
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

const sceneIcons = [<MorningIcon key="m" />, <LunchIcon key="l" />, <GiftIcon key="g" />];

export default function Concept() {
  return (
    <section id="concept">
      <SoftCurve />
      <div className="bg-milk">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading
            eyebrow="Concept"
            title={
              <>
                <span className="font-display italic text-crust">panpan</span>
                に込めた、
                <br />
                小さなしあわせ。
              </>
            }
          />

          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-center leading-loose text-cocoa/85">
            <p>
              {shopInfo.name}
              は、毎日の中にある小さな楽しみを大切にするベーグル専門店です。
            </p>
            <p>
              外は香ばしく、中はもちっと。
              <br />
              ひとつ食べるだけで、心もお腹も
              <span className="font-display font-semibold italic text-crust">
                &ldquo;panpan&rdquo;
              </span>
              に満たされるようなベーグルを目指しています。
            </p>
            <p>
              中板橋の街にそっと寄り添いながら、
              <br />
              その日焼き上がるベーグルをひとつひとつ丁寧にご用意しています。
            </p>
          </div>

          {/* 毎日のシーン */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {conceptScenes.map((scene, index) => (
              <FadeIn key={scene.title} delay={index * 100}>
                <div className="flex h-full flex-col items-center gap-3 rounded-card bg-soft px-5 py-7 text-center shadow-warm">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-milk text-crust">
                    {sceneIcons[index]}
                  </span>
                  <h3 className="font-bold tracking-wide">{scene.title}</h3>
                  <p className="text-sm leading-relaxed text-cocoa/75">
                    {scene.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ブランドコピー */}
          <p className="mt-14 text-center font-display text-lg font-semibold tracking-wider text-crust md:text-xl">
            — {shopInfo.brandCopy} —
          </p>
        </div>
      </div>
      <SoftCurve flip />
    </section>
  );
}
