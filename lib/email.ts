// メール通知（Resend）。環境変数が未設定の場合は何もしない。
// RESEND_API_KEY / RESEND_FROM_EMAIL / SHOP_NOTIFICATION_EMAIL を設定すると有効になる。

import { shopInfo, socialLinks } from "@/data/site";

type ReservationEmailData = {
  code: string;
  customerName: string;
  customerEmail: string;
  dayLabel: string;
  slotLabel: string;
  paymentLabel: string;
  total: number;
  items: { name: string; quantity: number; lineTotal: number }[];
};

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch (error) {
    // メール失敗で予約自体を失敗させない
    console.error("email send failed:", error);
  }
}

/** お客様向け予約完了メール＋店舗向け新規予約通知（設定がある場合のみ） */
export async function sendReservationEmails(data: ReservationEmailData) {
  const itemLines = data.items
    .map((i) => `・${i.name} × ${i.quantity}（¥${i.lineTotal.toLocaleString("ja-JP")}）`)
    .join("\n");

  const customerBody = `${data.customerName} 様

${shopInfo.name}のご予約ありがとうございます。
以下の内容で承りました。

予約番号：${data.code}
受け取り日：${data.dayLabel}
受け取り時間：${data.slotLabel}
お支払い：${data.paymentLabel}

【ご予約内容】
${itemLines}
合計：¥${data.total.toLocaleString("ja-JP")}

【受け取り場所】
${shopInfo.name}
${shopInfo.address}（${shopInfo.access}）
ネイビーの外観と白い看板が目印です。

【ご注意】
・オープン時間・受け取り時間は変更となる場合があります。
・最新情報はInstagramをご確認ください。
${socialLinks.instagram}

ご来店をお待ちしております。
${shopInfo.name}`;

  await sendEmail(
    data.customerEmail,
    `【${shopInfo.name}】ご予約ありがとうございます（${data.code}）`,
    customerBody,
  );

  const shopEmail = process.env.SHOP_NOTIFICATION_EMAIL;
  if (shopEmail) {
    const shopBody = `新しい予約が入りました。

予約番号：${data.code}
お客様名：${data.customerName}
受け取り：${data.dayLabel} ${data.slotLabel}
支払い：${data.paymentLabel}

${itemLines}
合計：¥${data.total.toLocaleString("ja-JP")}

管理画面で詳細をご確認ください。`;
    await sendEmail(shopEmail, `【新規予約】${data.code} ${data.customerName}様`, shopBody);
  }
}
