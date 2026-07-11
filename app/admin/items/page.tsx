"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { formatDateJa, yen } from "@/lib/format";
import type { SalesDay, SalesItem } from "@/lib/reservation";

export default function ItemsPage() {
  return (
    <AdminShell>
      <Items />
    </AdminShell>
  );
}

const inputClass =
  "rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-navy";

function Items() {
  const [days, setDays] = useState<SalesDay[]>([]);
  const [dayId, setDayId] = useState("");
  const [items, setItems] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    (async () => {
      const { data } = await supabase
        .from("sales_days")
        .select("*")
        .order("date", { ascending: false });
      setDays(data ?? []);
      if (data && data.length > 0) setDayId(data[0].id);
      setLoading(false);
    })();
  }, []);

  const loadItems = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !dayId) {
      setItems([]);
      return;
    }
    const { data } = await supabase
      .from("sales_items")
      .select("*, product:products(*)")
      .eq("sales_day_id", dayId)
      .order("display_order", { ascending: true });
    setItems((data ?? []) as SalesItem[]);
  }, [dayId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) return <p className="text-ink/60">読み込み中…</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-navy">販売商品の管理</h1>

      {days.length === 0 ? (
        <p className="mt-6 text-ink/70">
          先に「販売日」を作成してください。
        </p>
      ) : (
        <>
          <label className="mt-5 block">
            <span className="mb-1 block text-sm font-medium text-ink">販売日を選ぶ</span>
            <select value={dayId} onChange={(e) => setDayId(e.target.value)} className={`${inputClass} w-full sm:w-80`}>
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatDateJa(d.date)} {d.is_public ? "" : "（下書き）"}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 space-y-4">
            {items.length === 0 && (
              <p className="text-sm text-ink/60">この販売日の商品はまだありません。</p>
            )}
            {items.map((item) => (
              <ItemRow key={item.id} item={item} onChange={loadItems} />
            ))}
          </div>

          <AddItemForm dayId={dayId} onAdded={loadItems} />
        </>
      )}
    </div>
  );
}

function ItemRow({ item, onChange }: { item: SalesItem; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function patch(p: Partial<SalesItem>) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("sales_items").update(p).eq("id", item.id);
    onChange();
  }
  async function patchProduct(p: {
    name?: string;
    description?: string | null;
    allergy_note?: string | null;
    image_url?: string | null;
  }) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("products").update(p).eq("id", item.product_id);
    onChange();
  }
  async function remove() {
    if (!confirm(`「${item.product?.name}」を削除しますか？`)) return;
    setBusy(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.from("sales_items").delete().eq("id", item.id);
    setBusy(false);
    if (error) {
      alert("この商品には予約があるため削除できません。非公開にしてください。");
      return;
    }
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
    const path = `${item.product_id}/${Date.now()}.${ext}`;
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
    await supabase.from("products").update({ image_url: data.publicUrl }).eq("id", item.product_id);
    setUploading(false);
    onChange();
  }

  async function removeImage() {
    await patchProduct({ image_url: null });
  }

  const remaining = item.stock_quantity - item.reserved_quantity;
  const imageUrl = item.product?.image_url ?? null;

  return (
    <div className="rounded-card border border-line bg-warm p-5 shadow-warm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          defaultValue={item.product?.name ?? ""}
          onBlur={(e) => patchProduct({ name: e.target.value })}
          className={`${inputClass} flex-1 font-bold text-navy`}
          aria-label="商品名"
        />
        <button
          type="button"
          onClick={() => patch({ is_public: !item.is_public })}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.is_public ? "bg-navy text-paper" : "border border-line bg-cream text-ink/50"}`}
        >
          {item.is_public ? "公開中" : "非公開"}
        </button>
      </div>

      <textarea
        defaultValue={item.product?.description ?? ""}
        onBlur={(e) => patchProduct({ description: e.target.value || null })}
        rows={2}
        placeholder="商品説明"
        className={`${inputClass} mt-3 w-full`}
        aria-label="商品説明"
      />

      {/* 商品画像 */}
      <div className="mt-3 flex items-center gap-4 rounded-xl border border-line bg-cream p-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-warm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.product?.name ?? "商品画像"}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-ink/40">画像なし</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink/70">商品画像</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-full bg-navy px-4 py-1.5 text-xs font-medium text-paper hover:bg-navy-deep">
              {uploading ? "アップロード中…" : imageUrl ? "画像を変更" : "画像を選ぶ"}
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
            {imageUrl && (
              <button
                type="button"
                onClick={removeImage}
                className="text-xs text-bagel underline underline-offset-2"
              >
                画像を削除
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-ink/50">JPG/PNG・5MBまで</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Labeled label="価格(円)">
          <input type="number" min={0} defaultValue={item.price} onBlur={(e) => patch({ price: Number(e.target.value) })} className={`${inputClass} w-full`} />
        </Labeled>
        <Labeled label="販売数">
          <input type="number" min={0} defaultValue={item.stock_quantity} onBlur={(e) => patch({ stock_quantity: Number(e.target.value) })} className={`${inputClass} w-full`} />
        </Labeled>
        <Labeled label="表示順">
          <input type="number" defaultValue={item.display_order} onBlur={(e) => patch({ display_order: Number(e.target.value) })} className={`${inputClass} w-full`} />
        </Labeled>
        <Labeled label="予約 / 残り">
          <p className="px-1 py-2 text-sm font-bold text-navy">
            {item.reserved_quantity} / 残{remaining < 0 ? 0 : remaining}
          </p>
        </Labeled>
      </div>

      <input
        type="text"
        defaultValue={item.product?.allergy_note ?? ""}
        onBlur={(e) => patchProduct({ allergy_note: e.target.value || null })}
        placeholder="アレルギー注意メモ（任意）"
        className={`${inputClass} mt-3 w-full`}
        aria-label="アレルギー注意"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FlagButton label="季節限定" on={item.is_seasonal} onClick={() => patch({ is_seasonal: !item.is_seasonal })} />
        <FlagButton label="おすすめ" on={item.is_recommended} onClick={() => patch({ is_recommended: !item.is_recommended })} />
        <span className="ml-auto text-xs text-ink/50">単価 {yen(item.price)}</span>
        <button type="button" onClick={remove} disabled={busy} className="text-xs text-bagel underline underline-offset-2">
          削除
        </button>
      </div>
    </div>
  );
}

function AddItemForm({ dayId, onAdded }: { dayId: string; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("350");
  const [stock, setStock] = useState("10");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase || !name) return;
    setSaving(true);
    // 商品マスタを作成 → sales_items を作成
    const { data: product, error: pErr } = await supabase
      .from("products")
      .insert({ name })
      .select("id")
      .single();
    if (pErr || !product) {
      setSaving(false);
      alert("商品の作成に失敗しました。");
      return;
    }
    await supabase.from("sales_items").insert({
      sales_day_id: dayId,
      product_id: product.id,
      price: Number(price),
      stock_quantity: Number(stock),
      is_public: true,
    });
    setName("");
    setSaving(false);
    onAdded();
  }

  return (
    <form onSubmit={add} className="mt-6 rounded-card border border-dashed border-navy/30 bg-cream p-5">
      <p className="mb-3 text-sm font-bold text-bagel">この販売日に商品を追加</p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="block flex-1">
          <span className="mb-1 block text-xs text-ink/70">商品名</span>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} w-full`} placeholder="プレーン" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">価格</span>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputClass} w-24`} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/70">販売数</span>
          <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className={`${inputClass} w-24`} />
        </label>
        <button type="submit" disabled={saving} className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-paper hover:bg-navy-deep disabled:opacity-50">
          {saving ? "追加中…" : "追加"}
        </button>
      </div>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink/70">{label}</span>
      {children}
    </label>
  );
}

function FlagButton({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${on ? "bg-toast text-navy-deep" : "border border-line bg-warm text-ink/50"}`}
    >
      {label}
    </button>
  );
}
