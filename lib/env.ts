/**
 * 環境変数のヘルパー。
 * 未設定でもサイト全体が動くように、必ずここを通して参照する。
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type PaymentMode = "reservation_only" | "stripe";

/**
 * 決済モード。
 * NEXT_PUBLIC_PAYMENT_MODE=stripe かつ STRIPE_SECRET_KEY が設定されている場合のみ
 * オンライン決済モードになる（サーバー側での最終判定用）。
 */
export function serverPaymentMode(): PaymentMode {
  if (
    process.env.NEXT_PUBLIC_PAYMENT_MODE === "stripe" &&
    process.env.STRIPE_SECRET_KEY
  ) {
    return "stripe";
  }
  return "reservation_only";
}

/** クライアント表示用の決済モード（表示のみ。確定はサーバー側で行う） */
export function publicPaymentMode(): PaymentMode {
  return process.env.NEXT_PUBLIC_PAYMENT_MODE === "stripe"
    ? "stripe"
    : "reservation_only";
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bagels-panpan.vercel.app"
  ).replace(/\/$/, "");
}
