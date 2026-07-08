"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReserveHeader from "@/components/reserve/ReserveHeader";
import { cancelPolicy, socialLinks } from "@/data/site";
import { yen } from "@/lib/format";
import { publicPaymentMode } from "@/lib/env";
import {
  CART_STORAGE_KEY,
  LAST_ORDER_STORAGE_KEY,
  type CartPayload,
  type LastOrderSummary,
  orderErrorMessage,
} from "@/lib/reservation";

export default function ConfirmPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slotId, setSlotId] = useState("");
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const paymentMode = publicPaymentMode();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartPayload;
        setCart(parsed);
        const firstOpen = parsed.slots.find((s) => !s.full);
        if (firstOpen) setSlotId(firstOpen.id);
      }
    } catch {
      /* noop */
    }
    setLoaded(true);
  }, []);

  const total = cart?.items.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart) return;
    setError("");

    if (!slotId) {
      setError("受け取り時間帯を選択してください。");
      return;
    }
    if (!agreed) {
      setError("注意事項へのご同意が必要です。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salesDayId: cart.salesDayId,
          pickupSlotId: slotId,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          customerNote: note,
          agreed,
          items: cart.items.map((i) => ({
            salesItemId: i.salesItemId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(orderErrorMessage(data.error ?? ""));
        setSubmitting(false);
        return;
      }

      if (data.mode === "stripe" && data.checkoutUrl) {
        // Stripe Checkout へ遷移
        window.location.href = data.checkoutUrl;
        return;
      }

      // 予約のみモード：完了画面へ
      const slotLabel = cart.slots.find((s) => s.id === slotId)?.label ?? "";
      const summary: LastOrderSummary = {
        code: data.code,
        total: data.total,
        dayLabel: cart.dayLabel,
        slotLabel,
        paymentLabel: "店頭でお支払い",
        items: data.items,
      };
      sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(summary));
      sessionStorage.removeItem(CART_STORAGE_KEY);
      router.push("/reserve/complete");
    } catch {
      setError("通信に失敗しました。時間をおいてもう一度お試しください。");
      setSubmitting(false);
    }
  }

  if (loaded && !cart) {
    return (
      <div className="min-h-screen bg-warm text-ink">
        <ReserveHeader />
        <main className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <p className="text-lg font-bold text-navy">予約内容が見つかりません</p>
          <p className="mt-3 text-sm text-ink/75">
            お手数ですが、予約ページからもう一度お選びください。
          </p>
          <Link
            href="/reserve"
            className="mt-6 inline-flex rounded-full bg-navy px-8 py-3 text-sm font-medium text-paper hover:bg-navy-deep"
          >
            予約ページへ戻る
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm text-ink">
      <ReserveHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-2xl font-bold tracking-wide text-navy">予約内容の確認</h1>

        {cart && (
          <form onSubmit={submit} className="mt-8 space-y-8">
            {/* 予約内容 */}
            <section className="rounded-card border border-line bg-warm p-6 shadow-warm">
              <h2 className="text-sm font-bold text-bagel">ご予約内容</h2>
              <p className="mt-3 font-bold text-navy">{cart.dayLabel}</p>
              {cart.pickupNote && (
                <p className="text-sm text-ink/70">{cart.pickupNote}</p>
              )}
              <ul className="mt-4 divide-y divide-line">
                {cart.items.map((i) => (
                  <li key={i.salesItemId} className="flex justify-between py-2 text-sm">
                    <span>
                      {i.name} × {i.quantity}
                    </span>
                    <span className="font-medium">{yen(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-line pt-3 font-bold text-navy">
                <span>合計</span>
                <span>{yen(total)}</span>
              </div>
              <p className="mt-2 text-xs text-ink/60">
                {paymentMode === "stripe"
                  ? "この後、オンライン決済画面に進みます。"
                  : "お支払いは店頭でお願いします（QRコード決済可）。"}
              </p>
            </section>

            {/* 受け取り時間帯 */}
            <section className="rounded-card border border-line bg-warm p-6 shadow-warm">
              <h2 className="text-sm font-bold text-bagel">
                受け取り時間帯 <span className="text-bagel">必須</span>
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {cart.slots.map((s) => (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      s.full
                        ? "cursor-not-allowed border-line bg-cream text-ink/40"
                        : slotId === s.id
                          ? "border-navy bg-navy/5"
                          : "border-line hover:border-navy/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.id}
                      checked={slotId === s.id}
                      disabled={s.full}
                      onChange={() => setSlotId(s.id)}
                      className="accent-navy"
                    />
                    <span className="font-medium">{s.label}</span>
                    {s.full && <span className="ml-auto text-xs">満枠</span>}
                  </label>
                ))}
              </div>
            </section>

            {/* お客様情報 */}
            <section className="space-y-4 rounded-card border border-line bg-warm p-6 shadow-warm">
              <h2 className="text-sm font-bold text-bagel">お客様情報</h2>
              <Field label="お名前" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </Field>
              <Field label="電話番号" required>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="09012345678"
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </Field>
              <Field label="メールアドレス" required>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </Field>
              <Field label="備考・アレルギーや苦手なもの（任意）">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </Field>
            </section>

            {/* キャンセルポリシー・同意 */}
            <section className="rounded-card border border-line bg-cream p-6">
              <h2 className="text-sm font-bold text-bagel">キャンセルについて</h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
                {cancelPolicy.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-navy"
                />
                予約内容、受け取り日時、キャンセルポリシーを確認しました。
              </label>
            </section>

            {error && (
              <p className="rounded-lg bg-bagel/10 px-4 py-3 text-center text-sm font-medium text-bagel">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-navy px-8 py-4 font-bold text-paper shadow-warm transition-all hover:-translate-y-0.5 hover:bg-navy-deep disabled:opacity-50 sm:w-auto sm:flex-1"
              >
                {submitting
                  ? "送信中..."
                  : paymentMode === "stripe"
                    ? "決済に進む"
                    : "この内容で予約する"}
              </button>
              <Link
                href="/reserve"
                className="w-full rounded-full border border-navy/30 px-8 py-4 text-center font-medium text-navy transition-colors hover:bg-navy hover:text-paper sm:w-auto"
              >
                商品を選び直す
              </Link>
            </div>

            <p className="text-center text-xs text-ink/60">
              最新情報は
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0.5 font-medium text-navy underline underline-offset-2"
              >
                Instagram
              </a>
              をご確認ください。
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-bagel">必須</span>}
      </span>
      {children}
    </label>
  );
}
