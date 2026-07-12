"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BagelIllustration from "@/components/BagelIllustration";
import type { PaymentMode } from "@/lib/env";
import type { ReserveDay } from "@/lib/reserve-data";
import {
  CART_STORAGE_KEY,
  type CartPayload,
} from "@/lib/reservation";
import { yen } from "@/lib/format";

export default function ReserveClient({
  days,
  paymentMode,
}: {
  days: ReserveDay[];
  paymentMode: PaymentMode;
}) {
  const router = useRouter();
  const [selectedDayId, setSelectedDayId] = useState(days[0]?.id ?? "");
  // salesItemId -> quantity
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  const day = days.find((d) => d.id === selectedDayId) ?? days[0];

  // 販売日を切り替えたら数量をリセット
  function selectDay(id: string) {
    setSelectedDayId(id);
    setQuantities({});
    setError("");
  }

  function setQty(item: ReserveDay["items"][number], next: number) {
    const clamped = Math.max(0, Math.min(next, item.remaining, 10));
    setQuantities((prev) => ({ ...prev, [item.salesItemId]: clamped }));
    setError("");
  }

  const cartLines = useMemo(
    () =>
      day.items
        .map((it) => ({ item: it, qty: quantities[it.salesItemId] ?? 0 }))
        .filter((l) => l.qty > 0),
    [day, quantities],
  );

  const total = cartLines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const totalCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  const canReserve = day.acceptingOrders && day.withinWindow;
  const canProceed = cartLines.length > 0 && canReserve;

  const paymentLabel =
    paymentMode === "stripe" ? "オンライン決済" : "店頭でお支払い";

  function proceed() {
    if (!canReserve) {
      setError("現在この販売日の受付は終了しています。");
      return;
    }
    if (cartLines.length === 0) {
      setError("商品を1つ以上選択してください。");
      return;
    }
    const payload: CartPayload = {
      salesDayId: day.id,
      dayLabel: day.dateLabel,
      pickupNote: day.pickupNote,
      slots: day.slots.map((s) => ({ id: s.id, label: s.label, full: s.full })),
      items: cartLines.map((l) => ({
        salesItemId: l.item.salesItemId,
        name: l.item.name,
        price: l.item.price,
        quantity: l.qty,
      })),
    };
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    router.push("/reserve/confirm");
  }

  return (
    <div className="mt-8 sm:mt-10">
      {/* 販売日選択 */}
      {days.length > 1 && (
        <div className="mb-7">
          <p className="mb-3 text-sm font-bold text-navy">販売日を選ぶ</p>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => selectDay(d.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  d.id === selectedDayId
                    ? "border-navy bg-navy text-paper shadow-warm"
                    : "border-line bg-warm text-ink/75 hover:border-navy/40"
                }`}
              >
                {d.dateLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 販売日カード（ヘッダー）：日付 → 受け取り時間 → 補足 の優先順位 */}
      <div className="rounded-t-card border border-b-0 border-line bg-gradient-to-br from-navy-deep to-navy px-5 py-4 text-paper sm:px-7 sm:py-6">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-toast">
          Pickup Day
        </p>
        <p className="mt-1 whitespace-nowrap text-xl font-bold tracking-wide sm:text-2xl">
          {day.dateLabel}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {day.pickupNote && (
            <span className="whitespace-nowrap rounded-full border border-paper/20 bg-paper/10 px-3 py-1 text-[13px] font-medium text-paper">
              {day.pickupNote}
            </span>
          )}
          <span className="whitespace-nowrap rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-[13px] text-paper/80">
            {day.title ?? "予約販売"}
          </span>
        </div>
        {day.description && (
          <p className="mt-2.5 text-sm leading-relaxed text-paper/70">
            {day.description}
          </p>
        )}
      </div>

      {/* 受付終了の場合の案内 */}
      {!canReserve && (
        <div className="border-x border-line bg-cream px-6 py-4 text-center text-sm font-medium text-bagel">
          現在この販売日の受付は終了しています。
        </div>
      )}

      {/* 商品一覧（小さなメニューカードとして見せる） */}
      <div className="space-y-2.5 border-x border-line bg-cream/70 px-3 py-3.5 sm:space-y-3 sm:px-4 sm:py-5">
        {day.items.length === 0 && (
          <div className="rounded-2xl bg-warm px-6 py-8 text-center text-sm text-ink/70">
            この販売日の商品は現在準備中です。
          </div>
        )}
        {day.items.map((item) => {
          const qty = quantities[item.salesItemId] ?? 0;
          const selected = qty > 0;
          const soldOut = item.soldOut;
          return (
            <div
              key={item.salesItemId}
              className={`rounded-2xl border p-3.5 transition-colors sm:p-5 ${
                soldOut
                  ? "border-line/70 bg-cream/50"
                  : selected
                    ? "border-toast/80 bg-toast/[0.06] shadow-warm"
                    : "border-line bg-warm"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className={`h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20 ${
                      soldOut ? "opacity-50 saturate-50" : ""
                    }`}
                  />
                ) : (
                  <div
                    className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-cream sm:h-20 sm:w-20 ${
                      soldOut ? "opacity-50 saturate-50" : ""
                    }`}
                  >
                    <BagelIllustration
                      base={item.illustration.base}
                      topping={item.illustration.topping}
                      holeColor="var(--color-cream)"
                      className="h-12 w-12 sm:h-14 sm:w-14"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3
                      className={`font-bold tracking-wide ${
                        soldOut ? "text-ink/45" : "text-navy"
                      }`}
                    >
                      {item.name}
                    </h3>
                    {item.isSeasonal && (
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          soldOut
                            ? "bg-ink/5 text-ink/40"
                            : "bg-toast/20 text-bagel"
                        }`}
                      >
                        季節限定
                      </span>
                    )}
                    {item.isRecommended && (
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          soldOut
                            ? "bg-ink/5 text-ink/40"
                            : "bg-cream text-navy/70"
                        }`}
                      >
                        おすすめ
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        soldOut ? "text-ink/35" : "text-ink/70"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.allergyNote && (
                    <p
                      className={`mt-0.5 text-xs ${
                        soldOut ? "text-ink/35" : "text-bagel/90"
                      }`}
                    >
                      アレルギー：{item.allergyNote}
                    </p>
                  )}
                </div>
              </div>

              {/* 価格・残数と数量操作（メニューカードの下段） */}
              <div
                className={`mt-2.5 flex items-center justify-between gap-3 border-t pt-2.5 ${
                  soldOut ? "border-line/50" : "border-line/70"
                }`}
              >
                <p
                  className={`whitespace-nowrap font-bold tracking-wide ${
                    soldOut ? "text-ink/40" : "text-navy"
                  }`}
                >
                  {yen(item.price)}
                  {!soldOut && (
                    <span className="ml-2.5 text-xs font-normal text-ink/50">
                      残り{item.remaining}個
                    </span>
                  )}
                </p>
                {soldOut ? (
                  <span className="inline-block whitespace-nowrap rounded-full border border-line bg-ink/5 px-3.5 py-1.5 text-xs font-bold text-ink/45">
                    売り切れ
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <QtyButton
                      label="減らす"
                      variant="outline"
                      onClick={() => setQty(item, qty - 1)}
                      disabled={qty <= 0 || !canReserve}
                    >
                      −
                    </QtyButton>
                    <span
                      className={`w-9 text-center text-lg font-bold tabular-nums ${
                        selected ? "text-navy" : "text-ink/40"
                      }`}
                    >
                      {qty}
                    </span>
                    <QtyButton
                      label="増やす"
                      variant="solid"
                      onClick={() => setQty(item, qty + 1)}
                      disabled={qty >= item.remaining || qty >= 10 || !canReserve}
                    >
                      ＋
                    </QtyButton>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/*
        合計エリア。
        スマホは合計表示のみ（予約導線は下部固定バーに一本化）、
        PC・タブレットは従来どおり追従バー＋予約に進むボタン。
      */}
      <div className="rounded-b-card border border-line bg-warm px-4 py-3.5 shadow-warm sm:sticky sm:bottom-0 sm:px-6 sm:py-4 sm:shadow-warm-lg">
        {error && (
          <p className="mb-3 rounded-lg bg-bagel/10 px-3 py-2 text-center text-sm font-medium text-bagel">
            {error}
          </p>
        )}

        {/* スマホ：合計表示のみ */}
        <div className="flex items-baseline justify-between gap-3 sm:hidden">
          <p className="text-xs text-ink/60">
            <span className="whitespace-nowrap">合計 {totalCount}点</span>
            <span className="whitespace-nowrap">（{paymentLabel}）</span>
          </p>
          <p
            className={`whitespace-nowrap text-xl font-bold ${
              totalCount > 0 ? "text-navy" : "text-ink/40"
            }`}
          >
            {yen(total)}
          </p>
        </div>

        {/* PC・タブレット：合計＋予約に進む */}
        <div className="hidden items-center justify-between gap-4 sm:flex">
          <div className="min-w-0">
            <p className="text-xs text-ink/60">
              <span className="whitespace-nowrap">合計 {totalCount}点</span>
              <span className="whitespace-nowrap">（{paymentLabel}）</span>
            </p>
            <p
              className={`whitespace-nowrap text-2xl font-bold ${
                totalCount > 0 ? "text-navy" : "text-ink/40"
              }`}
            >
              {yen(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={proceed}
            disabled={!canProceed}
            className={`shrink-0 whitespace-nowrap rounded-full px-8 py-3.5 font-bold transition-all ${
              canProceed
                ? "bg-navy text-paper shadow-warm hover:-translate-y-0.5 hover:bg-navy-deep"
                : "cursor-not-allowed bg-ink/10 text-ink/40"
            }`}
          >
            予約に進む
          </button>
        </div>
      </div>

      {/*
        スマホ専用：商品を選択したときだけ現れる予約固定バー。
        既存の proceed() をそのまま使い、予約ロジックには触れない。
      */}
      <div
        className={`fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 transition-all duration-300 sm:hidden ${
          totalCount > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-paper/15 bg-navy-deep/95 py-2 pl-5 pr-2 shadow-warm backdrop-blur">
          <p className="min-w-0 text-paper">
            <span className="whitespace-nowrap text-xs text-paper/70">
              合計 {totalCount}点
            </span>
            <span className="ml-2 whitespace-nowrap text-lg font-bold">
              {yen(total)}
            </span>
          </p>
          <button
            type="button"
            onClick={proceed}
            className="shrink-0 whitespace-nowrap rounded-full bg-toast px-5 py-2.5 text-sm font-bold text-navy-deep transition-colors hover:bg-paper"
          >
            予約に進む
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyButton({
  children,
  onClick,
  disabled,
  label,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  variant: "outline" | "solid";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-full text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
        variant === "solid"
          ? "bg-navy text-paper hover:bg-navy-deep disabled:hover:bg-navy"
          : "border border-navy/25 text-navy hover:bg-navy/5 disabled:hover:bg-transparent"
      }`}
    >
      {children}
    </button>
  );
}
