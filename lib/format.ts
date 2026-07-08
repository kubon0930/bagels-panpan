/** 表示用フォーマッタ */

export function yen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** "2026-07-08" → "2026年7月8日（水）" */
export function formatDateJa(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = WEEKDAYS_JA[date.getUTCDay()];
  return `${y}年${m}月${d}日（${weekday}）`;
}

/** "12:00:00" → "12:00" */
export function formatTime(time: string | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

/** ISO日時 → "7/8 12:00" （管理画面用の短い表記） */
export function formatDateTimeShort(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}
