-- Store-wide settings editable from /admin/settings — starting with the
-- WhatsApp ordering number, which previously required an env var change
-- and a redeploy. Single-row table: id is always 'default'.

create table settings (
  id text primary key default 'default',
  whatsapp_number text not null default '',
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 'default')
);

create trigger settings_set_updated_at
  before update on settings
  for each row execute function set_updated_at();

alter table settings enable row level security;

-- Public read — the storefront needs the number to build WhatsApp links
-- without requiring a signed-in session.
create policy "settings_public_read"
  on settings for select
  to anon, authenticated
  using (true);

-- Only admins can change it.
create policy "settings_admin_write"
  on settings for update
  to authenticated
  using (true)
  with check (true);

create policy "settings_admin_insert"
  on settings for insert
  to authenticated
  with check (true);

insert into settings (id, whatsapp_number)
values ('default', '')
on conflict (id) do nothing;
