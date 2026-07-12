import type { Metadata } from "next";
import LegalLayout from "@/components/reserve/LegalLayout";
import { shopInfo, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜Bagels Panpan.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="プライバシーポリシー">
      <section>
        <h2 className="text-base font-bold text-navy">1. 取得する個人情報</h2>
        <p className="mt-2">
          予約販売のご利用にあたり、お名前・電話番号・メールアドレス・ご予約内容・
          備考（アレルギー情報などを含む場合があります）を取得します。
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-navy">2. 利用目的</h2>
        <p className="mt-2">
          ご予約の確認・準備・受け取り時のご連絡、商品のご用意、
          およびお客様へのご案内のために利用します。
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-navy">3. 第三者提供</h2>
        <p className="mt-2">
          法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。
          将来オンライン決済を導入した場合は、決済処理のために決済代行事業者へ
          必要な情報を送信します（導入時に本ポリシーを更新します）。
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-navy">4. お問い合わせ</h2>
        <p className="mt-2">
          個人情報の取り扱いに関するお問い合わせは、
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="mx-0.5 text-navy underline underline-offset-2">
            Instagram（{socialLinks.instagramHandle}）
          </a>
          または店頭までご連絡ください。
        </p>
      </section>
      <p className="text-xs text-ink/60">
        {/* TODO: 事業者名・連絡先・改定日を本番公開前に記載してください */}
        事業者：{shopInfo.name}（TODO: 正式名称・連絡先・制定日を記載）
      </p>
    </LegalLayout>
  );
}
