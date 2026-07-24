-- ============================================================
-- 予約者名のフリガナ（customer_name_kana）を追加する
-- Supabase の SQL Editor に貼り付けて実行してください（0006 のあと）。
--
-- ・orders にフリガナ列を追加（既存注文は NULL のまま・影響なし）
-- ・create_order 関数にフリガナ引数を追加（デフォルト NULL なので旧呼び出しも動く）
-- ============================================================

alter table public.orders
  add column if not exists customer_name_kana text;

-- 旧シグネチャを破棄して、フリガナ引数つきで作り直す
drop function if exists public.create_order(uuid, uuid, text, text, text, text, jsonb, text);

create or replace function public.create_order(
  p_sales_day_id uuid,
  p_pickup_slot_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_note text,
  p_items jsonb,
  p_payment_mode text default 'reservation_only',
  p_customer_name_kana text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day public.sales_days%rowtype;
  v_slot public.pickup_slots%rowtype;
  v_req record;
  v_item record;
  v_order_id uuid := gen_random_uuid();
  v_code text;
  v_counter integer;
  v_month text := to_char(now() at time zone 'Asia/Tokyo', 'YYYYMM');
  v_subtotal integer := 0;
  v_items_out jsonb := '[]'::jsonb;
  v_count integer := 0;
begin
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'INVALID_INPUT';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'INVALID_INPUT';
  end if;

  select * into v_day from public.sales_days
    where id = p_sales_day_id
      and is_public
      and is_accepting_orders
      and (reservation_start_at is null or reservation_start_at <= now())
      and (reservation_end_at is null or reservation_end_at >= now())
    for update;
  if not found then
    raise exception 'RESERVATION_CLOSED';
  end if;

  select * into v_slot from public.pickup_slots
    where id = p_pickup_slot_id and sales_day_id = p_sales_day_id and is_public
    for update;
  if not found then
    raise exception 'SLOT_NOT_FOUND';
  end if;
  if v_slot.capacity is not null and v_slot.reserved_count >= v_slot.capacity then
    raise exception 'SLOT_FULL';
  end if;

  insert into public.reservation_counters as rc (month, counter)
    values (v_month, 1)
    on conflict (month) do update set counter = rc.counter + 1
    returning counter into v_counter;
  v_code := 'BP-' || v_month || '-' || lpad(v_counter::text, 4, '0');

  insert into public.orders (
    id, reservation_code, sales_day_id, pickup_slot_id,
    customer_name, customer_name_kana, customer_phone, customer_email, customer_note,
    subtotal, total, order_status, payment_status, payment_method
  ) values (
    v_order_id, v_code, p_sales_day_id, p_pickup_slot_id,
    trim(p_customer_name),
    nullif(trim(coalesce(p_customer_name_kana, '')), ''),
    trim(p_customer_phone), trim(p_customer_email), nullif(trim(coalesce(p_customer_note, '')), ''),
    0, 0,
    case when p_payment_mode = 'stripe' then 'pending_payment' else 'confirmed' end,
    case when p_payment_mode = 'stripe' then 'unpaid' else 'pay_at_store' end,
    case when p_payment_mode = 'stripe' then 'online' else 'store' end
  );

  for v_req in
    select (e ->> 'sales_item_id')::uuid as sales_item_id,
           (e ->> 'quantity')::integer as quantity
    from jsonb_array_elements(p_items) e
  loop
    if v_req.quantity is null or v_req.quantity <= 0 or v_req.quantity > 20 then
      raise exception 'INVALID_QUANTITY';
    end if;

    select si.id, si.price, si.stock_quantity, si.reserved_quantity, p.name as product_name
      into v_item
      from public.sales_items si
      join public.products p on p.id = si.product_id
      where si.id = v_req.sales_item_id
        and si.sales_day_id = p_sales_day_id
        and si.is_public
        and p.is_active
      for update of si;
    if not found then
      raise exception 'ITEM_NOT_FOUND';
    end if;
    if v_item.stock_quantity - v_item.reserved_quantity < v_req.quantity then
      raise exception 'OUT_OF_STOCK:%', v_item.product_name;
    end if;

    update public.sales_items
      set reserved_quantity = reserved_quantity + v_req.quantity, updated_at = now()
      where id = v_req.sales_item_id;

    insert into public.order_items (order_id, sales_item_id, product_name, unit_price, quantity, line_total)
      values (v_order_id, v_item.id, v_item.product_name, v_item.price, v_req.quantity, v_item.price * v_req.quantity);

    v_subtotal := v_subtotal + v_item.price * v_req.quantity;
    v_count := v_count + v_req.quantity;
    v_items_out := v_items_out || jsonb_build_object(
      'name', v_item.product_name,
      'unit_price', v_item.price,
      'quantity', v_req.quantity,
      'line_total', v_item.price * v_req.quantity
    );
  end loop;

  update public.orders set subtotal = v_subtotal, total = v_subtotal, updated_at = now()
    where id = v_order_id;
  update public.pickup_slots set reserved_count = reserved_count + 1, updated_at = now()
    where id = p_pickup_slot_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'reservation_code', v_code,
    'total', v_subtotal,
    'item_count', v_count,
    'items', v_items_out
  );
end;
$$;

grant execute on function public.create_order(uuid, uuid, text, text, text, text, jsonb, text, text) to anon, authenticated;
