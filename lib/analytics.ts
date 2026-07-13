/**
 * Google Analytics 4 の計測ユーティリティ。
 * イベント名・パラメータをここに一元管理し、各コンポーネントからは
 * track〜 関数を呼ぶだけにする（gtag 未ロード時は何もしない）。
 *
 * 計測は本番環境のみ：
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID が未設定なら一切動作しない
 * - 開発環境（NODE_ENV !== production）では gtag を読み込まない
 * - Vercel の Preview 環境（NEXT_PUBLIC_VERCEL_ENV=preview）でも読み込まない
 *
 * 個人情報（氏名・電話・メール・備考など）は絶対に送信しないこと。
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const gaEnabled =
  GA_MEASUREMENT_ID !== "" &&
  process.env.NODE_ENV === "production" &&
  (process.env.NEXT_PUBLIC_VERCEL_ENV === undefined ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production");

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | undefined>;

/** GA4へイベントを送る共通関数。gtag未定義（未計測環境）では何もしない */
export function gaEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** SPA遷移を含むページビュー送信（gtag config は send_page_view: false で初期化） */
export function trackPageView(url: string) {
  gaEvent("page_view", {
    page_location: window.location.origin + url,
    page_path: url,
    page_title: document.title,
  });
}

/** 画面幅ベースの簡易デバイス判定 */
export function deviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/* ---------- UTM（流入元）の保持 ---------- */

const UTM_STORAGE_KEY = "bp_utm";

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

/** ランディング時のUTMパラメータをセッション中保持する */
export function captureUtm(searchParams: URLSearchParams) {
  try {
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    if (!source && !medium && !campaign) return;
    const utm: UtmParams = {};
    if (source) utm.utm_source = source;
    if (medium) utm.utm_medium = medium;
    if (campaign) utm.utm_campaign = campaign;
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    /* noop */
  }
}

export function getStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

/* ---------- 予約ファネル ---------- */

/** 予約導線の設置場所（GA4のカスタムディメンション button_location） */
export type ReservationButtonLocation =
  | "header"
  | "menu"
  | "hero"
  | "hero_card"
  | "before_visit"
  | "how_to_visit"
  | "instagram_section"
  | "access"
  | "floating"
  | "footer";

/** 予約ボタンのクリック（全予約CTA共通） */
export function trackReservationClick(input: {
  location: ReservationButtonLocation;
  text: string;
  destination: string;
}) {
  gaEvent("reservation_click", {
    button_location: input.location,
    button_text: input.text,
    destination_url: input.destination,
    page_path: window.location.pathname,
    device_type: deviceType(),
  });
}

/** 予約ページ到達（/reserve の表示） */
export function trackReservationPageView(input: { sourcePage: string }) {
  gaEvent("reservation_page_view", {
    page_path: window.location.pathname,
    referrer: document.referrer || undefined,
    source_page: input.sourcePage || undefined,
    ...getStoredUtm(),
  });
}

const COMPLETE_SENT_PREFIX = "bp_ga_complete_";

/**
 * 予約完了。予約番号ごとに1回だけ送信する
 * （完了ページの再読み込み・戻る操作での二重送信を防止）。
 */
export function trackReservationComplete(input: {
  reservationId: string;
  itemCount?: number;
  totalQuantity?: number;
  totalValue?: number;
  pickupDate?: string;
  paymentMethod?: string;
}) {
  if (!input.reservationId) return;
  const key = COMPLETE_SENT_PREFIX + input.reservationId;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* sessionStorage 不可でも送信は行う */
  }
  gaEvent("reservation_complete", {
    reservation_id: input.reservationId,
    item_count: input.itemCount,
    total_quantity: input.totalQuantity,
    total_value: input.totalValue,
    currency: input.totalValue !== undefined ? "JPY" : undefined,
    pickup_date: input.pickupDate,
    payment_method: input.paymentMethod,
    ...getStoredUtm(),
  });
}

/* ---------- 外部リンク ---------- */

export type OutboundLinkType = "instagram" | "map" | "tabelog" | "other";

/** 外部リンクのクリック。Instagram/地図は専用イベントも合わせて送る */
export function trackOutboundClick(input: {
  linkType: OutboundLinkType;
  text: string;
  destination: string;
}) {
  const params = {
    link_type: input.linkType,
    link_text: input.text,
    destination_url: input.destination,
    page_path: window.location.pathname,
  };
  gaEvent("outbound_click", params);
  if (input.linkType === "instagram") gaEvent("instagram_click", params);
  if (input.linkType === "map") gaEvent("map_click", params);
}

/** 電話番号リンク（現在は未設置。将来設置したときに使用） */
export function trackPhoneClick(input: { text: string; destination: string }) {
  gaEvent("phone_click", {
    link_text: input.text,
    destination_url: input.destination,
    page_path: window.location.pathname,
  });
}
