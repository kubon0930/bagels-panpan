import SectionHeading from "@/components/SectionHeading";
import SoftCurve from "@/components/SoftCurve";
import { faqItems } from "@/data/site";

export default function FAQ() {
  return (
    <section id="faq">
      <SoftCurve />
      <div className="bg-milk">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading
            eyebrow="FAQ"
            title={<span className="font-display">FAQ</span>}
            description="はじめてのご来店前に、よくいただくご質問をまとめました。"
          />

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-card bg-soft px-6 py-5 shadow-warm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3">
                    <span className="font-display font-bold text-toast">Q.</span>
                    <span className="leading-relaxed">{item.question}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-milk text-lg font-medium text-crust transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="flex items-start gap-3 pt-4 text-sm leading-loose text-cocoa/85">
                  <span className="font-display font-bold text-crust">A.</span>
                  <span>{item.answer}</span>
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <SoftCurve flip />
    </section>
  );
}
