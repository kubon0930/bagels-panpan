-- ============================================================
-- 開発確認用サンプルデータ
-- 次の水曜日の販売日と、商品4種（各10個）、受け取り時間帯3枠を作成します。
-- Supabase SQL Editor で 0001_reservation_system.sql のあとに実行してください。
-- ============================================================

do $$
declare
  v_next_wed date;
  v_day_id uuid := gen_random_uuid();
  v_plain uuid := gen_random_uuid();
  v_cheese uuid := gen_random_uuid();
  v_choco uuid := gen_random_uuid();
  v_seasonal uuid := gen_random_uuid();
begin
  -- 次の水曜日（今日が水曜なら翌週）
  v_next_wed := current_date + (((3 - extract(dow from current_date)::int + 7) % 7));
  if v_next_wed = current_date then
    v_next_wed := v_next_wed + 7;
  end if;

  insert into public.sales_days
    (id, date, title, description, pickup_start_time, pickup_end_time,
     reservation_start_at, reservation_end_at, is_public, is_accepting_orders, note)
  values
    (v_day_id, v_next_wed, '水曜日の予約販売',
     'テスト用の販売日です。', '12:00', '14:00',
     now(), (v_next_wed::timestamp + interval '10 hours') at time zone 'Asia/Tokyo',
     true, true, 'seed データ');

  insert into public.products (id, name, description, allergy_note) values
    (v_plain, 'プレーン', '小麦の香りともちもち食感を楽しむ定番ベーグル。', null),
    (v_cheese, 'チーズ', '焼き上がりのチーズの香りが食欲をそそる人気ベーグル。', '乳成分を含みます'),
    (v_choco, 'チョコレート', 'ほんのり甘く、コーヒーにもよく合うおやつ系ベーグル。', null),
    (v_seasonal, '季節のベーグル', '季節の素材を使った、その時だけの限定ベーグル。', null);

  insert into public.sales_items
    (sales_day_id, product_id, price, stock_quantity, display_order, is_seasonal, is_recommended)
  values
    (v_day_id, v_plain, 350, 10, 1, false, true),
    (v_day_id, v_cheese, 420, 10, 2, false, false),
    (v_day_id, v_choco, 400, 10, 3, false, false),
    (v_day_id, v_seasonal, 450, 10, 4, true, false);

  insert into public.pickup_slots (sales_day_id, label, start_time, end_time, capacity) values
    (v_day_id, '12:00〜12:30', '12:00', '12:30', 10),
    (v_day_id, '12:30〜13:00', '12:30', '13:00', 10),
    (v_day_id, '13:00〜13:30', '13:00', '13:30', 10);
end $$;
