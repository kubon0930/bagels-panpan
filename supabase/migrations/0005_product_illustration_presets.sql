-- ============================================================
-- 予約販売の商品にもベーグルイラスト（ベース色＋トッピング）を設定できるようにし、
-- あわせて「定番商品」登録の仕組みを追加する
-- Supabase の SQL Editor に貼り付けて実行してください（0004 のあと）。
--
-- ・products（商品マスタ）にイラスト2軸と定番フラグ・既定価格を追加
-- ・既存データはデフォルト（こんがり × なし・定番OFF）のままで影響なし
-- ・RLSは既存の products ポリシー（公開読み取り／管理者のみ変更）をそのまま利用
-- ============================================================

alter table public.products
  add column if not exists bagel_base text not null default 'golden',
  add column if not exists bagel_topping text not null default 'none',
  add column if not exists is_standard boolean not null default false,
  add column if not exists default_price integer;

alter table public.products
  drop constraint if exists products_bagel_base_check;
alter table public.products
  add constraint products_bagel_base_check
  check (bagel_base in (
    'plain', 'golden', 'whole_wheat', 'cheese', 'chocolate',
    'matcha', 'berry', 'pumpkin', 'seasonal'
  ));

alter table public.products
  drop constraint if exists products_bagel_topping_check;
alter table public.products
  add constraint products_bagel_topping_check
  check (bagel_topping in (
    'none', 'sesame', 'black_sesame', 'cheese_crust',
    'chocolate_chip', 'cinnamon', 'sugar', 'seeds'
  ));
