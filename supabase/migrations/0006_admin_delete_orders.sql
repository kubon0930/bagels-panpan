-- ============================================================
-- 管理者がキャンセル済み・期限切れの予約記録を削除できるようにする
-- Supabase の SQL Editor に貼り付けて実行してください（0005 のあと）。
--
-- 用途：テスト予約しか入っていない販売日などを、管理画面から
-- 「予約記録ごと完全削除」できるようにするための権限追加。
-- 有効な予約が残っている販売日は、アプリ側のチェックで削除できません。
-- order_items は orders の on delete cascade で一緒に消えます
-- （FKの連鎖削除はRLSの対象外のため、order_items 側のポリシー追加は不要）。
-- ============================================================

drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders" on public.orders
  for delete using (public.is_admin());
