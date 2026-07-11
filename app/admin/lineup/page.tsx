"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { BagelTone } from "@/data/site";

type LineupRow = {
  id: string;
  name: string;
  name_ja: string | null;
  description: string | null;
  image_url: string | null;
  tag: string | null;
  tone: BagelTone;
  display_order: number;
  is_public: boolean;
};

const TONE_LABELS: Record<BagelTone, string> = {
  golden: "こんがり（黄金色）",
  cheese: "チーズ（濃い黄）",
  chocolate: "チョコ（茶）",
  seasonal: "季節（赤み）",
};

const inputClass =
  "rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy";

export default function LineupAdminPage() {
  return (
    <AdminShell>
      <Lineup />
    </AdminShell>
  );
}

function Lineup() {
  const [items, setItems] = useState<LineupRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("lineup_items")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data ?? []) as LineupRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-ink/60">読み込み中…</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-navy">
        ラインナップの管理
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        ホームページ「その日並ぶベーグル」に表示される内容です。
        写真を登録すると写真に、なければ焼き色のイラストで表示されます。
        変更は公式サイトに最大1分ほどで反映されます。
      </p>

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-ink/60">まだ登録がありません。下から追加してください。</p>
        )}
        {items.map((item) => (
          <Row key={item.id} item={item} onChange={load} />
        ))}
      </div>

      <AddForm onAdded={load} nextOrder={items.length + 1} />
    </div>
  );
}

function Row({ item, onChange }: { item: LineupRow; onChange: () => void }) {
  const [uploading, setUploading] = useState(false);

  async function patch(p: Partial<LineupRow>) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("lineup_items").update(p).eq("id", item.id);
    onChange();
  }

  async function uploadImage(file: File) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("画像は5MBまでにしてください。");
      return;
    }
    setUploading(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `lineup/${item.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      setUploading(false);
      alert(
        "画像のアップロードに失敗しました。Supabaseで 0002_product_images.sql を実行済みかご確認ください。",
      );
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("lineup_items").update({ image_url: data.publicUrl }).eq("id", item.id);
    setUploading(false);
    onChange();
  }

  async function remove() {
    if (!confirm(`「${item.name}」を削除しますか？`)) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("lineup_items").delete().eq("id", item.id);
    onChange();
  }

  return (
    <div className="rounded-card border border-line bg-warm p-5 shadow-warm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          defaultValue={item.name}
          onBlur={(e) => patch({ name: e.target.value })}
          className={`${inputClass} flex-1 font-bold text-navy`}
          aria-label="商品名（英字）"
          placeholder="Plain Bagel"
        />
        <button
          type="button"
          onClick={() => patch({ is_public: !item.is_public })}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.is_public ? "bg-navy text-paper" : "border border-line bg-cream text-ink/50"}`}
        >
          {item.is_public ? "表示中" : "非表示"}
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">日本語名（任意）</span>
          <input type="text" defaultValue={item.name_ja ?? ""} onBlur={(e) => patch({ name_ja: e.target.value || null })} className={`${inputClass} w-full`} placeholder="プレーン" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">タグ（任意・例：Limited）</span>
          <input type="text" defaultValue={item.tag ?? ""} onBlur={(e) => patch({ tag: e.target.value || null })} className={`${inputClass} w-full`} placeholder="Limited" />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-ink/70">説明</span>
        <textarea
          defaultValue={item.description ?? ""}
          onBlur={(e) => patch({ description: e.target.value || null })}
          rows={2}
          className={`${inputClass} w-full`}
          placeholder="小麦の香りともちもち食感を楽しむ、まず食べたい定番ベーグル。"
        />
      </label>

      {/* 画像 */}
      <div className="mt-3 flex items-center gap-4 rounded-xl border border-line bg-cream p-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-warm">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} width={80} height={80} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-ink/40">画像なし</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink/70">商品画像</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-full bg-navy px-4 py-1.5 text-xs font-medium text-paper hover:bg-navy-deep">
              {uploading ? "アップロード中…" : item.image_url ? "画像を変更" : "画像を選ぶ"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                  e.target.value = "";
                }}
              />
            </label>
            {item.image_url && (
              <button type="button" onClick={() => patch({ image_url: null })} className="text-xs text-bagel underline underline-offset-2">
                画像を削除
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-ink/50">
            画像なしの場合、下の「焼き色」のイラストで表示されます
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">焼き色（画像なし時）</span>
          <select
            defaultValue={item.tone}
            onChange={(e) => patch({ tone: e.target.value as BagelTone })}
            className={`${inputClass} w-full`}
          >
            {(Object.keys(TONE_LABELS) as BagelTone[]).map((t) => (
              <option key={t} value={t}>{TONE_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">表示順</span>
          <input type="number" defaultValue={item.display_order} onBlur={(e) => patch({ display_order: Number(e.target.value) })} className={`${inputClass} w-full`} />
        </label>
      </div>

      <div className="mt-3 text-right">
        <button type="button" onClick={remove} className="text-xs text-bagel underline underline-offset-2">
          このベーグルを削除
        </button>
      </div>
    </div>
  );
}

function AddForm({ onAdded, nextOrder }: { onAdded: () => void; nextOrder: number }) {
  const [name, setName] = useState("");
  const [nameJa, setNameJa] = useState("");
  const [tone, setTone] = useState<BagelTone>("golden");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !name) return;
    setSaving(true);
    await supabase.from("lineup_items").insert({
      name,
      name_ja: nameJa || null,
      tone,
      display_order: nextOrder,
      is_public: true,
    });
    setName("");
    setNameJa("");
    setTone("golden");
    setSaving(false);
    onAdded();
  }

  return (
    <form onSubmit={add} className="mt-6 rounded-card border border-dashed border-navy/30 bg-cream p-5">
      <p className="mb-3 text-sm font-bold text-bagel">ベーグルを追加</p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="block flex-1">
          <span className="mb-1 block text-xs text-ink/70">商品名（英字）</span>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} w-full`} placeholder="Plain Bagel" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">日本語名</span>
          <input type="text" value={nameJa} onChange={(e) => setNameJa(e.target.value)} className={`${inputClass} w-32`} placeholder="プレーン" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">焼き色</span>
          <select value={tone} onChange={(e) => setTone(e.target.value as BagelTone)} className={`${inputClass}`}>
            {(Object.keys(TONE_LABELS) as BagelTone[]).map((t) => (
              <option key={t} value={t}>{TONE_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={saving} className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-paper hover:bg-navy-deep disabled:opacity-50">
          {saving ? "追加中…" : "追加"}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink/60">追加後、説明文や画像を登録できます。</p>
    </form>
  );
}
