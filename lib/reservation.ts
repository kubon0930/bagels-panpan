/** 予約販売システムで使う型とラベル定義 */

export type SalesDay = {
  id: string;
  date: string;
  title: string | null;
  description: string | null;
  pickup_start_time: string | null;
  pickup_end_time: string | null;
  reservation_start_at: string | null;
  reservation_end_at: string | null;
  is_public: boolean;
  is_accepting_orders: boolean;
  note: string | null;
};

export type PickupSlot = {
  id: string;
  sales_day_id: string;
  label: string;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  reserved_count: number;
  is_public: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  allergy_note: string | null;
  is_active: boolean;
};

export type SalesItem = {
  id: string;
  sales_day_id: string;
  product_id: string;
  price: number;
  stock_quantity: number;
  reserved_quantity: number;
  display_order: number;
  is_public: boolean;
  is_recommended: boolean;
  is_seasonal: boolean;
  product: Product;
};

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "cancelled"
  | "expired"
  | "no_show";

export type PaymentStatus =
  | "pay_at_store"
  | "unpaid"
  | "paid"
  | "failed"
  | "refunded";

export type Order = {
  id: string;
  reservation_code: string;
  sales_day_id: string;
  pickup_slot_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_note: string | null;
  admin_note: string | null;
  subtotal: number;
  total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  sales_item_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "決済待ち",
  confirmed: "予約確定",
  preparing: "準備中",
  ready: "受け取り可",
  picked_up: "受け取り済み",
  cancelled: "キャンセル",
  expired: "期限切れ",
  no_show: "未受け取り",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pay_at_store: "店頭支払い",
  unpaid: "未払い",
  paid: "支払い済み",
  failed: "決済失敗",
  refunded: "返金済み",
};

/** /reserve → /reserve/confirm 間で sessionStorage に保存するカート */
export type CartPayload = {
  salesDayId: string;
  dayLabel: string;
  pickupNote: string;
  slots: { id: string; label: string; full: boolean }[];
  items: {
    salesItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

export const CART_STORAGE_KEY = "bp-reserve-cart";
export const LAST_ORDER_STORAGE_KEY = "bp-last-order";

/** 予約完了画面で表示する内容 */
export type LastOrderSummary = {
  code: string;
  total: number;
  dayLabel: string;
  slotLabel: string;
  paymentLabel: string;
  items: { name: string; quantity: number; lineTotal: number }[];
};

/** create_order 関数のエラーを日本語メッセージに変換 */
export function orderErrorMessage(raw: string): string {
  if (raw.includes("OUT_OF_STOCK")) {
    const name = raw.split("OUT_OF_STOCK:")[1]?.split(/["\n]/)[0] ?? "";
    return `${name ? `「${name}」は` : ""}選択された数量をご用意できません。数量を変更してください。`;
  }
  if (raw.includes("RESERVATION_CLOSED")) {
    return "現在この販売日の受付は終了しています。";
  }
  if (raw.includes("SLOT_FULL")) {
    return "選択された受け取り時間帯は満枠です。別の時間帯をお選びください。";
  }
  if (raw.includes("SLOT_NOT_FOUND")) {
    return "受け取り時間帯を選択してください。";
  }
  if (raw.includes("ITEM_NOT_FOUND")) {
    return "選択された商品は現在ご予約いただけません。ページを再読み込みしてください。";
  }
  if (raw.includes("INVALID_QUANTITY")) {
    return "数量の指定に誤りがあります。";
  }
  return "予約を完了できませんでした。時間をおいてもう一度お試しください。";
}
