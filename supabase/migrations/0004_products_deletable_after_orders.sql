-- Products that had ever been ordered could never be deleted:
-- order_items.product_id had `on delete restrict`, so any product with order
-- history — even a single cancelled test order — permanently blocked
-- deletion. That's tighter than it needs to be: order_items already
-- snapshots everything needed to render order history (product_name,
-- variant_value, unit_price, quantity, total_price); nothing reads the live
-- product row back for a past order (see lib/data/adminCatalog.ts
-- getOrderWithItems). Relax the FK to `on delete set null` so a product can
-- be deleted once no order still in progress references it — the app layer
-- (DELETE /api/products) enforces that "in progress" check; this migration
-- only removes the DB-level block that made it impossible even after every
-- order was completed or cancelled.

do $$
declare
  fk_name text;
begin
  select conname into fk_name
  from pg_constraint
  where conrelid = 'order_items'::regclass
    and confrelid = 'products'::regclass
    and contype = 'f';

  if fk_name is not null then
    execute format('alter table order_items drop constraint %I', fk_name);
  end if;
end $$;

alter table order_items
  alter column product_id drop not null;

alter table order_items
  add constraint order_items_product_id_fkey
  foreign key (product_id) references products (id) on delete set null;
