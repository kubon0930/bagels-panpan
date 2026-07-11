-- ============================================================
-- 商品画像の保存先（Supabase Storage）
-- 予約販売システムに商品画像を登録できるようにするための追加設定です。
-- Supabase の SQL Editor に貼り付けて実行してください（0001 のあと）。
-- ============================================================

-- 公開バケット product-images を作成（お客様の予約ページで画像を表示するため公開）
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 誰でも閲覧できる（公開バケット）
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

-- アップロード・更新・削除は管理者のみ
drop policy if exists "admin insert product images" on storage.objects;
create policy "admin insert product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
