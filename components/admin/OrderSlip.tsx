import { formatDateJa, yen } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/reservation";

/** 注文票1枚に必要なデータ（印刷用） */
export type SlipOrder = {
  code: string;
  customerName: string;
  date: string; // "2026-07-24"
  slotLabel: string;
  items: { name: string; quantity: number }[];
  total: number;
  paymentMethodLabel: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  note: string | null;
};

/**
 * 商品袋へ貼る注文票（B5・上下2件レイアウトの1枚分）。
 * 文字は大きめ・装飾なし・切って貼れるように下端に切り取り線。
 */
export default function OrderSlip({ order }: { order: SlipOrder }) {
  return (
    <div className="slip">
      <div className="slip-inner">
        {/* 上段：予約番号・お客様名 */}
        <div className="slip-head">
          <div>
            <div className="slip-code">{order.code}</div>
            <div className="slip-name">{order.customerName} 様</div>
          </div>
          <div className="slip-pickup">
            <div className="slip-date">{formatDateJa(order.date)}</div>
            <div className="slip-slot">{order.slotLabel || "受け取り時間未設定"}</div>
          </div>
        </div>

        {/* 商品一覧 */}
        <ul className="slip-items">
          {order.items.map((it, i) => (
            <li key={i} className="slip-item">
              <span className="slip-item-name">{it.name}</span>
              <span className="slip-item-qty">×{it.quantity}</span>
            </li>
          ))}
        </ul>

        {/* 合計・支払い・状態 */}
        <div className="slip-foot">
          <div className="slip-total">合計 {yen(order.total)}</div>
          <div className="slip-meta">
            <span>{order.paymentMethodLabel}</span>
            <span>／</span>
            <span>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</span>
            <span>／</span>
            <span>{ORDER_STATUS_LABELS[order.orderStatus]}</span>
          </div>
        </div>

        {order.note && <div className="slip-note">備考：{order.note}</div>}
      </div>
      <div className="slip-cut" aria-hidden="true">
        ✂ ─────────────────────────────
      </div>
    </div>
  );
}
