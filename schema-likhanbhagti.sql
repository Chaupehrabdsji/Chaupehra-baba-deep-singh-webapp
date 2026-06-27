-- ── LIKHAN BHAGTI SAMGAM SIGNUPS ─────────────────────────────────────────────
-- Run in Supabase SQL Editor

create table if not exists likhanbhagti_signups (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null,
  email       text,
  age_group   text not null check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above')),
  city        text,
  message     text,
  status      text default 'registered' check (status in ('registered','confirmed','declined')),
  created_at  timestamptz default now()
);

alter table likhanbhagti_signups enable row level security;

-- Public: insert only (no reading own data)
create policy "public insert likhanbhagti"
  on likhanbhagti_signups for insert with check (true);

-- Admin: full access
create policy "admin all likhanbhagti"
  on likhanbhagti_signups for all using (auth.role() = 'authenticated');
