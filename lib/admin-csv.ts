import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/reservation";

export type AdminOrderRow = {
  id: string;
  code: string;
  dateLabel: string;
  slotLabel: string;
  name: string;
  nameKana: string;
  phone: string;
  email: string;
  items: { name: string; quantity: number }[];
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  note: string;
};

function csvCell(value: string | number): string {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** 予約一覧を CSV でダウンロード（店頭での取り置き・電話確認用） */
export function downloadOrdersCsv(rows: AdminOrderRow[], dateLabel: string) {
  const header = [
    "予約番号",
    "受け取り日",
    "受け取り時間帯",
    "お客様名",
    "フリガナ",
    "電話番号",
    "メールアドレス",
    "商品名",
    "数量",
    "合計金額",
    "支払い状況",
    "注文ステータス",
    "備考",
  ];

  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    const itemsText = r.items.map((i) => `${i.name}×${i.quantity}`).join(" / ");
    const totalQty = r.items.reduce((s, i) => s + i.quantity, 0);
    lines.push(
      [
        r.code,
        r.dateLabel,
        r.slotLabel,
        r.name,
        r.nameKana,
        r.phone,
        r.email,
        itemsText,
        totalQty,
        r.total,
        PAYMENT_STATUS_LABELS[r.paymentStatus],
        ORDER_STATUS_LABELS[r.orderStatus],
        r.note,
      ]
        .map(csvCell)
        .join(","),
    );
  }

  // Excel で文字化けしないよう BOM を付与
  const blob = new Blob(["﻿" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `予約一覧_${(dateLabel || "export").replace(/-/g, "")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
