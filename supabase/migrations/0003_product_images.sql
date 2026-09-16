-- Additional gallery images per product. products.image_url /
-- cloudinary_public_id remain the single "cover" image used everywhere a
-- product needs exactly one photo (grid card, cart line items, admin
-- table) — this table only holds the *extra* images shown in the
-- customer-facing gallery lightbox.

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  image_url text not null,
  cloudinary_public_id text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on product_images (product_id);

alter table product_images enable row level security;

-- Public can read gallery images of active products.
create policy "product_images_public_read"
  on product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
      and products.is_active = true
    )
  );

create policy "product_images_admin_all"
  on product_images for all
  to authenticated
  using (true)
  with check (true);
