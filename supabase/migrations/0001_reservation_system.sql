-- ============================================================
-- Bagels Panpan. 予約販売システム
-- Supabase SQL Editor にこのファイルの内容を貼り付けて実行してください。
-- ============================================================

-- ------------------------------------------------------------
-- 管理者テーブル（このメールアドレスの Supabase Auth ユーザーだけが管理画面に入れます）
-- ------------------------------------------------------------
create table if not exists public.app_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- 管理者判定（SECURITY DEFINER で RLS をバイパスして app_admins を参照）
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ------------------------------------------------------------
-- 販売日
-- ------------------------------------------------------------
create table if not exists public.sales_days (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
  description text,
  pickup_start_time time,
  pickup_end_time time,
  reservation_start_at timestamptz,
  reservation_end_at timestamptz,
  is_public boolean not null default false,
  is_accepting_orders boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 受け取り時間帯
-- ------------------------------------------------------------
create table if not exists public.pickup_slots (
  id uuid primary key default gen_random_uuid(),
  sales_day_id uuid not null references public.sales_days(id) on delete cascade,
  label text not null,
  start_time time,
  end_time time,
  capacity integer,
  reserved_count integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pickup_slots_day on public.pickup_slots(sales_day_id);

-- ------------------------------------------------------------
-- 商品マスタ
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  allergy_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 販売日ごとの販売商品（価格・数量）
-- ------------------------------------------------------------
create table if not exists public.sales_items (
  id uuid primary key default gen_random_uuid(),
  sales_day_id uuid not null references public.sales_days(id) on delete cascade,
  product_id uuid not null references public.products(id),
  price integer not null check (price >= 0),
  stock_quantity integer not null check (stock_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  display_order integer not null default 0,
  is_public boolean not null default true,
  is_recommended boolean not null default false,
  is_seasonal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sales_items_day on public.sales_items(sales_day_id);

-- ------------------------------------------------------------
-- 注文
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reservation_code text unique not null,
  sales_day_id uuid not null references public.sales_days(id),
  pickup_slot_id uuid references public.pickup_slots(id),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_note text,
  admin_note text,
  subtotal integer not null,
  total integer not null,
  order_status text not null check (order_status in
    ('pending_payment','confirmed','preparing','ready','picked_up','cancelled','expired','no_show')),
  payment_status text not null check (payment_status in
    ('pay_at_store','unpaid','paid','failed','refunded')),
  payment_method text,
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_day on public.orders(sales_day_id);
create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_orders_stripe_session on public.orders(stripe_session_id);

-- ------------------------------------------------------------
-- 注文明細
-- ------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sales_item_id uuid not null references public.sales_items(id),
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0),
  line_total integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- ------------------------------------------------------------
-- 予約番号カウンター（月ごとに 0001 から採番）
-- ------------------------------------------------------------
create table if not exists public.reservation_counters (
  month text primary key,
  counter integer not null default 0
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.app_admins enable row level security;
alter table public.sales_days enable row level security;
alter table public.pickup_slots enable row level security;
alter table public.products enable row level security;
alter table public.sales_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reservation_counters enable row level security;

-- 管理者は自分たちの一覧を確認できる
create policy "admin read app_admins" on public.app_admins
  for select using (public.is_admin());

-- お客様（未ログイン含む）は公開中の販売日だけ読める
create policy "public read sales_days" on public.sales_days
  for select using (is_public);
create policy "admin all sales_days" on public.sales_days
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read pickup_slots" on public.pickup_slots
  for select using (
    is_public and exists (
      select 1 from public.sales_days d
      where d.id = sales_day_id and d.is_public
    )
  );
create policy "admin all pickup_slots" on public.pickup_slots
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read products" on public.products
  for select using (is_active);
create policy "admin all products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read sales_items" on public.sales_items
  for select using (
    is_public and exists (
      select 1 from public.sales_days d
      where d.id = sales_day_id and d.is_public
    )
  );
create policy "admin all sales_items" on public.sales_items
  for all using (public.is_admin()) with check (public.is_admin());

-- 注文はお客様からは読めない（作成は create_order 関数経由のみ）
create policy "admin read orders" on public.orders
  for select using (public.is_admin());
create policy "admin update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin read order_items" on public.order_items
  for select using (public.is_admin());

-- reservation_counters はポリシーなし（関数内でのみ更新）

-- ------------------------------------------------------------
-- 注文作成関数
-- 在庫確認・在庫確保・注文作成を1トランザクションで行い、
-- 複数人が同時に予約しても在庫を超えないようにする（行ロック使用）。
-- ------------------------------------------------------------
create or replace function public.create_order(
  p_sales_day_id uuid,
  p_pickup_slot_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_note text,
  p_items jsonb,
  p_payment_mode text default 'reservation_only'
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
  -- 入力チェック
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'INVALID_INPUT';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'INVALID_INPUT';
  end if;

  -- 販売日の確認（公開中・受付中・受付期間内）
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

  -- 受け取り時間帯の確認（上限チェック）
  select * into v_slot from public.pickup_slots
    where id = p_pickup_slot_id and sales_day_id = p_sales_day_id and is_public
    for update;
  if not found then
    raise exception 'SLOT_NOT_FOUND';
  end if;
  if v_slot.capacity is not null and v_slot.reserved_count >= v_slot.capacity then
    raise exception 'SLOT_FULL';
  end if;

  -- 予約番号の採番（BP-YYYYMM-0001 形式）
  insert into public.reservation_counters as rc (month, counter)
    values (v_month, 1)
    on conflict (month) do update set counter = rc.counter + 1
    returning counter into v_counter;
  v_code := 'BP-' || v_month || '-' || lpad(v_counter::text, 4, '0');

  -- 注文本体を作成（合計はあとで更新）
  insert into public.orders (
    id, reservation_code, sales_day_id, pickup_slot_id,
    customer_name, customer_phone, customer_email, customer_note,
    subtotal, total, order_status, payment_status, payment_method
  ) values (
    v_order_id, v_code, p_sales_day_id, p_pickup_slot_id,
    trim(p_customer_name), trim(p_customer_phone), trim(p_customer_email), nullif(trim(coalesce(p_customer_note, '')), ''),
    0, 0,
    case when p_payment_mode = 'stripe' then 'pending_payment' else 'confirmed' end,
    case when p_payment_mode = 'stripe' then 'unpaid' else 'pay_at_store' end,
    case when p_payment_mode = 'stripe' then 'online' else 'store' end
  );

  -- 商品ごとに在庫を確認して確保（行ロックで同時予約に対応）
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

  -- 合計・時間帯カウントを更新
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

-- お客様（anon）から呼べるのはこの関数だけ
grant execute on function public.create_order(uuid, uuid, text, text, text, text, jsonb, text) to anon, authenticated;

-- ------------------------------------------------------------
-- 注文キャンセル・期限切れ処理（在庫を戻す）
-- 管理者または service_role のみ実行可能。
-- ------------------------------------------------------------
create or replace function public.cancel_order(
  p_order_id uuid,
  p_new_status text default 'cancelled'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item record;
begin
  if auth.role() is distinct from 'service_role' and not public.is_admin() then
    raise exception 'FORBIDDEN';
  end if;
  if p_new_status not in ('cancelled', 'expired', 'no_show') then
    raise exception 'INVALID_STATUS';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  -- すでに在庫を戻した注文は二重に戻さない
  if v_order.order_status in ('cancelled', 'expired') then
    return;
  end if;

  -- 在庫を戻す（no_show は商品を用意済みのため在庫は戻さない）
  if p_new_status in ('cancelled', 'expired') then
    for v_item in
      select sales_item_id, quantity from public.order_items where order_id = p_order_id
    loop
      update public.sales_items
        set reserved_quantity = greatest(reserved_quantity - v_item.quantity, 0), updated_at = now()
        where id = v_item.sales_item_id;
    end loop;
    if v_order.pickup_slot_id is not null then
      update public.pickup_slots
        set reserved_count = greatest(reserved_count - 1, 0), updated_at = now()
        where id = v_order.pickup_slot_id;
    end if;
  end if;

  update public.orders
    set order_status = p_new_status, updated_at = now()
    where id = p_order_id;
end;
$$;

revoke execute on function public.cancel_order(uuid, text) from public, anon;
grant execute on function public.cancel_order(uuid, text) to authenticated, service_role;

-- ------------------------------------------------------------
-- updated_at 自動更新
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_sales_days_updated on public.sales_days;
create trigger trg_sales_days_updated before update on public.sales_days
  for each row execute function public.set_updated_at();
drop trigger if exists trg_pickup_slots_updated on public.pickup_slots;
create trigger trg_pickup_slots_updated before update on public.pickup_slots
  for each row execute function public.set_updated_at();
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_items_updated on public.sales_items;
create trigger trg_sales_items_updated before update on public.sales_items
  for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 管理者の登録（★必ず自分のメールアドレスに変更して実行してください）
-- Supabase Auth（Authentication > Users）にも同じメールのユーザーを作成する必要があります。
-- ------------------------------------------------------------
-- insert into public.app_admins (email) values ('your-email@example.com');
