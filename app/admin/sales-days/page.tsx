"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa, formatTime } from "@/lib/format";
import type { PickupSlot, SalesDay } from "@/lib/reservation";

export default function SalesDaysPage() {
  return (
    <AdminShell>
      <SalesDays />
    </AdminShell>
  );
}

type DayWithSlots = SalesDay & { slots: PickupSlot[] };

function SalesDays() {
  const [days, setDays] = useState<DayWithSlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("sales_days")
      .select("*, slots:pickup_slots(*)")
      .order("date", { ascending: false });
    setDays(
      (data ?? []).map((d) => ({
        ...d,
        slots: ((d.slots ?? []) as PickupSlot[]).sort((a, b) =>
          (a.start_time ?? "").localeCompare(b.start_time ?? ""),
        ),
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-navy">販売日の管理</h1>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-paper hover:bg-navy-deep"
        >
          {showCreate ? "閉じる" : "＋ 新しい販売日"}
        </button>
      </div>

      {showCreate && (
        <CreateDayForm
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}

      {loading ? (
        <p className="mt-6 text-ink/60">読み込み中…</p>
      ) : days.length === 0 ? (
        <p className="mt-6 text-ink/70">販売日がまだありません。</p>
      ) : (
        <div className="mt-6 space-y-4">
          {days.map((day) => (
            <DayCard key={day.id} day={day} onChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy";

function CreateDayForm({ onCreated }: { onCreated: () => void }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("予約販売");
  const [pickupStart, setPickupStart] = useState("12:00");
  const [pickupEnd, setPickupEnd] = useState("14:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !date) return;
    setSaving(true);
    setError("");
    const { error: insErr } = await supabase.from("sales_days").insert({
      date,
      title: title || null,
      pickup_start_time: pickupStart || null,
      pickup_end_time: pickupEnd || null,
      is_public: false,
      is_accepting_orders: false,
    });
    if (insErr) {
      setError("作成に失敗しました。");
      setSaving(false);
      return;
    }
    setSaving(false);
    onCreated();
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 rounded-card border border-line bg-warm p-5 shadow-warm"
    >
      <p className="mb-3 text-sm font-bold text-bagel">新しい販売日を作成</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">販売日</span>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">タイトル</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">受け取り開始</span>
          <input type="time" value={pickupStart} onChange={(e) => setPickupStart(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">受け取り終了</span>
          <input type="time" value={pickupEnd} onChange={(e) => setPickupEnd(e.target.value)} className={inputClass} />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-bagel">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-paper hover:bg-navy-deep disabled:opacity-50"
      >
        {saving ? "作成中…" : "作成する（下書き）"}
      </button>
      <p className="mt-2 text-xs text-ink/60">
        作成後に商品や受け取り時間帯を登録し、「公開」「受付中」に切り替えるとお客様に表示されます。
      </p>
    </form>
  );
}

function DayCard({ day, onChange }: { day: DayWithSlots; onChange: () => void }) {
  const [busy, setBusy] = useState(false);

  async function toggle(field: "is_public" | "is_accepting_orders") {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy(true);
    await supabase.from("sales_days").update({ [field]: !day[field] }).eq("id", day.id);
    setBusy(false);
    onChange();
  }

  async function updateField(patch: Partial<SalesDay>) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("sales_days").update(patch).eq("id", day.id);
    onChange();
  }

  async function remove() {
    if (!confirm(`${formatDateJa(day.date)} を削除しますか？（予約がある場合は削除できません）`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("sales_days").delete().eq("id", day.id);
    if (error) {
      alert("この販売日には予約または商品が紐づいているため削除できません。先に非公開にしてください。");
      return;
    }
    onChange();
  }

  return (
    <div className="rounded-card border border-line bg-warm p-5 shadow-warm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-navy">{formatDateJa(day.date)}</p>
          <p className="text-sm text-ink/70">
            {day.title ?? "予約販売"}
            {day.pickup_start_time && day.pickup_end_time
              ? `｜${formatTime(day.pickup_start_time)}〜${formatTime(day.pickup_end_time)} 受け取り`
              : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Toggle label="公開" on={day.is_public} onClick={() => toggle("is_public")} disabled={busy} />
          <Toggle label="受付中" on={day.is_accepting_orders} onClick={() => toggle("is_accepting_orders")} disabled={busy} />
        </div>
      </div>

      {/* 受付期間 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">受付開始日時</span>
          <input
            type="datetime-local"
            defaultValue={toLocalInput(day.reservation_start_at)}
            onBlur={(e) => updateField({ reservation_start_at: fromLocalInput(e.target.value) })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink/70">受付終了日時</span>
          <input
            type="datetime-local"
            defaultValue={toLocalInput(day.reservation_end_at)}
            onBlur={(e) => updateField({ reservation_end_at: fromLocalInput(e.target.value) })}
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-ink/70">販売日メモ（店舗用）</span>
        <input
          type="text"
          defaultValue={day.note ?? ""}
          onBlur={(e) => updateField({ note: e.target.value || null })}
          className={inputClass}
        />
      </label>

      {/* 受け取り時間帯 */}
      <SlotEditor day={day} onChange={onChange} />

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={remove} className="text-xs text-bagel underline underline-offset-2">
          この販売日を削除
        </button>
      </div>
    </div>
  );
}

function SlotEditor({ day, onChange }: { day: DayWithSlots; onChange: () => void }) {
  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cap, setCap] = useState("10");

  async function addSlot() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const finalLabel = label || (start && end ? `${start}〜${end}` : "");
    if (!finalLabel) return;
    await supabase.from("pickup_slots").insert({
      sales_day_id: day.id,
      label: finalLabel,
      start_time: start || null,
      end_time: end || null,
      capacity: cap ? Number(cap) : null,
    });
    setLabel("");
    setStart("");
    setEnd("");
    onChange();
  }

  async function delSlot(id: string) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("pickup_slots").delete().eq("id", id);
    if (error) alert("この時間帯には予約があるため削除できません。");
    onChange();
  }

  return (
    <div className="mt-4 rounded-xl border border-line bg-cream p-4">
      <p className="mb-2 text-xs font-bold text-bagel">受け取り時間帯</p>
      {day.slots.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {day.slots.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm">
              <span>
                {s.label}
                <span className="ml-2 text-xs text-ink/60">
                  {s.reserved_count}
                  {s.capacity !== null ? ` / ${s.capacity}` : ""}件
                </span>
              </span>
              <button type="button" onClick={() => delSlot(s.id)} className="text-xs text-bagel underline">
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-end gap-2">
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={`${inputClass} w-28`} aria-label="開始時刻" />
        <span className="pb-2 text-ink/50">〜</span>
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={`${inputClass} w-28`} aria-label="終了時刻" />
        <input type="number" min={1} value={cap} onChange={(e) => setCap(e.target.value)} className={`${inputClass} w-20`} aria-label="上限数" placeholder="上限" />
        <button type="button" onClick={addSlot} className="rounded-full bg-navy px-4 py-2 text-xs font-medium text-paper hover:bg-navy-deep">
          追加
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, on, onClick, disabled }: { label: string; on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
        on ? "bg-navy text-paper" : "bg-cream text-ink/50 border border-line"
      }`}
    >
      {label}：{on ? "ON" : "OFF"}
    </button>
  );
}

// datetime-local <-> ISO 変換（ローカルタイム前提）
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string): string | null {
  if (!v) return null;
  return new Date(v).toISOString();
}
