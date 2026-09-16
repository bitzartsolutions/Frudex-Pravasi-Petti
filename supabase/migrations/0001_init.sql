-- Frudex Pravasi Petti — initial schema
-- Run via `supabase db push` or the Supabase SQL editor.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  cloudinary_public_id text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_display_order_idx on categories (display_order);
create index categories_is_active_idx on categories (is_active);

create trigger categories_set_updated_at
  before update on categories
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  cloudinary_public_id text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products (category_id);
create index products_display_order_idx on products (display_order);
create index products_is_active_idx on products (is_active);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  variant_type text not null check (variant_type in ('weight', 'pieces', 'pack', 'size')),
  variant_value text not null,
  price numeric(10, 2) not null check (price > 0),
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, variant_value)
);

create index product_variants_product_id_idx on product_variants (product_id);
create index product_variants_is_available_idx on product_variants (is_available);

create trigger product_variants_set_updated_at
  before update on product_variants
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  whatsapp_number text not null,
  delivery_location text not null,
  customer_message text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  additional_charge numeric(10, 2) not null default 0 check (additional_charge >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- order_items — snapshot product/variant data at time of order
-- ---------------------------------------------------------------------------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id) on delete restrict,
  variant_id uuid references product_variants (id) on delete set null,
  product_name text not null,
  variant_type text,
  variant_value text,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on order_items (order_id);
create index order_items_product_id_idx on order_items (product_id);

-- ---------------------------------------------------------------------------
-- admin_profiles — optional display metadata for signed-in admins.
-- Every row in auth.users that can sign in to /admin is treated as an
-- admin; there is no separate public signup flow, so no role column is
-- needed for authorization — RLS below simply checks `authenticated`.
-- ---------------------------------------------------------------------------
create table admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_profiles enable row level security;

-- categories: public can read active rows; admins can do everything.
create policy "categories_public_read_active"
  on categories for select
  to anon, authenticated
  using (is_active = true);

create policy "categories_admin_all"
  on categories for all
  to authenticated
  using (true)
  with check (true);

-- products: public can read active rows; admins can do everything.
create policy "products_public_read_active"
  on products for select
  to anon, authenticated
  using (is_active = true);

create policy "products_admin_all"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- product_variants: public can read available variants of active products;
-- admins can do everything.
create policy "product_variants_public_read_available"
  on product_variants for select
  to anon, authenticated
  using (
    is_available = true
    and exists (
      select 1 from products
      where products.id = product_variants.product_id
      and products.is_active = true
    )
  );

create policy "product_variants_admin_all"
  on product_variants for all
  to authenticated
  using (true)
  with check (true);

-- orders / order_items: no public policies at all. Customer order creation
-- goes exclusively through the POST /api/orders route handler using the
-- service-role client, which bypasses RLS. Only admins may read/update.
create policy "orders_admin_all"
  on orders for all
  to authenticated
  using (true)
  with check (true);

create policy "order_items_admin_all"
  on order_items for all
  to authenticated
  using (true)
  with check (true);

-- admin_profiles: an admin can read/update their own profile row.
create policy "admin_profiles_self_select"
  on admin_profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "admin_profiles_self_upsert"
  on admin_profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "admin_profiles_self_update"
  on admin_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
