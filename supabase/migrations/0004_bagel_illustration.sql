-- ============================================================
-- ベーグルイラストを「ベース色 + トッピング」の2軸管理に拡張する
-- Supabase の SQL Editor に貼り付けて実行してください（0003 のあと）。
--
-- ・旧 tone カラムは後方互換のため残します（削除しません）
-- ・既存データは tone から bagel_base / bagel_topping に自動変換します
--   golden    -> golden    × none
--   cheese    -> cheese    × cheese_crust
--   chocolate -> chocolate × chocolate_chip
--   seasonal  -> seasonal  × none
-- ============================================================

alter table public.lineup_items
  add column if not exists bagel_base text not null default 'golden',
  add column if not exists bagel_topping text not null default 'none';

-- 既存データの変換（未設定＝デフォルト値のままの行だけを対象にし、再実行しても安全にする）
update public.lineup_items
set
  bagel_base = case tone
    when 'cheese' then 'cheese'
    when 'chocolate' then 'chocolate'
    when 'seasonal' then 'seasonal'
    else 'golden'
  end,
  bagel_topping = case tone
    when 'cheese' then 'cheese_crust'
    when 'chocolate' then 'chocolate_chip'
    else 'none'
  end
where bagel_base = 'golden' and bagel_topping = 'none' and tone <> 'golden';

-- 値の制約（lib/bagel-illustration.ts の選択肢と揃える）
alter table public.lineup_items
  drop constraint if exists lineup_items_bagel_base_check;
alter table public.lineup_items
  add constraint lineup_items_bagel_base_check
  check (bagel_base in (
    'plain',
    'golden',
    'whole_wheat',
    'cheese',
    'chocolate',
    'matcha',
    'berry',
    'pumpkin',
    'seasonal'
  ));

alter table public.lineup_items
  drop constraint if exists lineup_items_bagel_topping_check;
alter table public.lineup_items
  add constraint lineup_items_bagel_topping_check
  check (bagel_topping in (
    'none',
    'sesame',
    'black_sesame',
    'cheese_crust',
    'chocolate_chip',
    'cinnamon',
    'sugar',
    'seeds'
  ));
