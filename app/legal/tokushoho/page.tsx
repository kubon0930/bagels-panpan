import type { Metadata } from "next";
import LegalLayout from "@/components/reserve/LegalLayout";
import { shopInfo, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記｜Bagels Panpan.",
  robots: { index: false },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line py-3 sm:grid-cols-[8rem_1fr]">
      <dt className="font-medium text-navy">{label}</dt>
      <dd className="text-ink/80">{children}</dd>
    </div>
  );
}

export default function TokushohoPage() {
  return (
    <LegalLayout title="特定商取引法に基づく表記">
      <dl>
        <Row label="販売事業者">{shopInfo.name}（TODO: 正式な事業者名）</Row>
        <Row label="販売責任者">TODO: 販売責任者名</Row>
        <Row label="所在地">{shopInfo.address}</Row>
        <Row label="お問い合わせ">
          Instagram（
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">
            {socialLinks.instagramHandle}
          </a>
          ）／ TODO: 電話・メール
        </Row>
        <Row label="販売価格">各商品ページに表示する金額（税込）</Row>
        <Row label="商品代金以外の必要料金">なし（店頭受け取りのため送料なし）</Row>
        <Row label="お支払い方法">
          オンライン決済（クレジットカード）または店頭でのQRコード決済
        </Row>
        <Row label="支払い時期">
          オンライン決済：ご予約時／店頭支払い：受け取り時
        </Row>
        <Row label="商品の引き渡し時期">
          ご予約時に選択された販売日・受け取り時間帯に店頭でお渡しします。
        </Row>
        <Row label="キャンセル・返金">
          <Link_ href="/legal/cancel-policy">キャンセルポリシー</Link_>をご確認ください。
        </Row>
      </dl>
    </LegalLayout>
  );
}

// LegalLayout 内で使う内部リンク
function Link_({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-navy underline underline-offset-2">
      {children}
    </a>
  );
}
