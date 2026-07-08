// Stripe クライアント（サーバー専用）。
// STRIPE_SECRET_KEY が未設定の場合は null を返し、予約のみモードで動作する。
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}
