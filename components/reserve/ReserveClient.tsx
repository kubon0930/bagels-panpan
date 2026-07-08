"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="mt-10">
      {/* 販売日選択 */}
      {days.length > 1 && (
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold text-navy">販売日を選ぶ</p>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => selectDay(d.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  d.id === selectedDayId
                    ? "border-navy bg-navy text-paper"
                    : "border-line bg-warm text-ink/80 hover:border-navy/40"
                }`}
              >
                {d.dateLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 販売日の見出し */}
      <div className="rounded-t-card border border-line bg-navy px-6 py-5 text-paper">
        <p className="text-lg font-bold tracking-wide">{day.dateLabel}</p>
        <p className="mt-1 text-sm text-paper/80">
          {day.title ?? "予約販売"}
          {day.pickupNote ? `｜${day.pickupNote}` : ""}
        </p>
        {day.description && (
          <p className="mt-2 text-sm leading-relaxed text-paper/75">
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

      {/* 商品一覧 */}
      <div className="space-y-px border-x border-line bg-line">
        {day.items.length === 0 && (
          <div className="bg-warm px-6 py-8 text-center text-sm text-ink/70">
            この販売日の商品は現在準備中です。
          </div>
        )}
        {day.items.map((item) => {
          const qty = quantities[item.salesItemId] ?? 0;
          return (
            <div
              key={item.salesItemId}
              className={`bg-warm px-5 py-5 sm:px-6 ${item.soldOut ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy">{item.name}</h3>
                    {item.isSeasonal && (
                      <span className="rounded-full bg-toast px-2 py-0.5 text-[11px] font-bold text-navy-deep">
                        季節限定
                      </span>
                    )}
                    {item.isRecommended && (
                      <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-bold text-navy">
                        おすすめ
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-ink/75">
                      {item.description}
                    </p>
                  )}
                  {item.allergyNote && (
                    <p className="mt-1 text-xs text-bagel">
                      アレルギー：{item.allergyNote}
                    </p>
                  )}
                  <p className="mt-2 font-bold text-ink">{yen(item.price)}</p>
                </div>

                {/* 数量 or 売り切れ */}
                <div className="shrink-0 text-center">
                  {item.soldOut ? (
                    <span className="inline-block rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-ink/60">
                      売り切れ
                      <span className="block text-[10px] font-normal">Sold out</span>
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <QtyButton
                          label="減らす"
                          onClick={() => setQty(item, qty - 1)}
                          disabled={qty <= 0 || !canReserve}
                        >
                          −
                        </QtyButton>
                        <span className="w-8 text-lg font-bold tabular-nums text-navy">
                          {qty}
                        </span>
                        <QtyButton
                          label="増やす"
                          onClick={() => setQty(item, qty + 1)}
                          disabled={qty >= item.remaining || qty >= 10 || !canReserve}
                        >
                          ＋
                        </QtyButton>
                      </div>
                      <p className="mt-1 text-xs text-ink/60">残り{item.remaining}個</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 合計・予約に進む（下部固定バー） */}
      <div className="sticky bottom-0 rounded-b-card border border-line bg-warm px-6 py-4 shadow-warm-lg">
        {error && (
          <p className="mb-3 rounded-lg bg-bagel/10 px-3 py-2 text-center text-sm font-medium text-bagel">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-ink/60">
              合計 {totalCount}点
              {paymentMode === "stripe" ? "（オンライン決済）" : "（店頭でお支払い）"}
            </p>
            <p className="text-2xl font-bold text-navy">{yen(total)}</p>
          </div>
          <button
            type="button"
            onClick={proceed}
            disabled={cartLines.length === 0 || !canReserve}
            className="rounded-full bg-navy px-8 py-3.5 font-bold text-paper shadow-warm transition-all hover:-translate-y-0.5 hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-navy/30 text-lg font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy"
    >
      {children}
    </button>
  );
}
