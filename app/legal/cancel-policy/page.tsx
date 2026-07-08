import type { Metadata } from "next";
import LegalLayout from "@/components/reserve/LegalLayout";
import { cancelPolicy } from "@/data/site";

export const metadata: Metadata = {
  title: "キャンセルポリシー｜Bagels Panpan.",
  robots: { index: false },
};

export default function CancelPolicyPage() {
  return (
    <LegalLayout title="キャンセルポリシー">
      <div className="space-y-3">
        {cancelPolicy.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="text-xs text-ink/60">
        {/* TODO: キャンセル期限・返金条件・返金方法などを店舗の運用に合わせて記載してください */}
        ※ 具体的なキャンセル期限や返金条件は、本番公開前に店舗の運用に合わせてご記載ください。
      </p>
    </LegalLayout>
  );
}
