-- ============================================================
-- ホームページ「その日並ぶベーグル（Lineup）」を管理画面から編集できるようにする
-- Supabase の SQL Editor に貼り付けて実行してください（0001・0002 のあと）。
-- 画像は 0002 で作成した product-images バケットを流用します（追加のバケット作成は不要）。
-- ============================================================

create table if not exists public.lineup_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ja text,
  description text,
  image_url text,
  tag text,
  -- 写真がないときに表示する仮グラフィックの焼き色
  tone text not null default 'golden' check (tone in ('golden', 'cheese', 'chocolate', 'seasonal')),
  display_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lineup_items_order on public.lineup_items(display_order);

alter table public.lineup_items enable row level security;

-- お客様（未ログイン含む）は公開中のものだけ読める
drop policy if exists "public read lineup_items" on public.lineup_items;
create policy "public read lineup_items" on public.lineup_items
  for select using (is_public);

-- 管理者のみ追加・変更・削除できる
drop policy if exists "admin all lineup_items" on public.lineup_items;
create policy "admin all lineup_items" on public.lineup_items
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at 自動更新（set_updated_at は 0001 で定義済み）
drop trigger if exists trg_lineup_items_updated on public.lineup_items;
create trigger trg_lineup_items_updated before update on public.lineup_items
  for each row execute function public.set_updated_at();

-- 現在ホームページに載っている5品を初期データとして登録（まだ無い場合のみ）
insert into public.lineup_items (name, name_ja, description, tag, tone, display_order)
select * from (values
  ('Plain Bagel', 'プレーン', '小麦の香りともちもち食感を楽しむ、まず食べたい定番ベーグル。', null, 'golden', 1),
  ('Sesame Bagel', 'セサミ', '香ばしいごまの風味が広がる、食事にも合わせやすい一品。', null, 'golden', 2),
  ('Cheese Bagel', 'チーズ', '焼き上がりのチーズの香りが食欲をそそる人気メニュー。', null, 'cheese', 3),
  ('Chocolate Bagel', 'チョコレート', 'ほんのり甘く、コーヒーにもよく合うおやつ系ベーグル。', null, 'chocolate', 4),
  ('Seasonal Bagel', '季節限定', '季節の素材を使った、その時だけの限定ベーグル。', 'Limited', 'seasonal', 5)
) as v(name, name_ja, description, tag, tone, display_order)
where not exists (select 1 from public.lineup_items);
