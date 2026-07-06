-- ============================================================
-- CHAUPEHRA BABA DEEP SINGH JI — Full Schema
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / IF EXISTS guards)
-- ============================================================

-- ── EVENTS ──────────────────────────────────────────────────
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  date         date not null,
  end_date     date,
  start_time   time,
  end_time     time,
  path_type    text,
  kirtani      text,
  notes        text,
  is_gurpurab  boolean default false,
  is_recurring boolean default false,
  is_published boolean default true,
  created_at   timestamptz default now()
);

alter table events enable row level security;
create policy if not exists "public read events"
  on events for select using (is_published = true);
create policy if not exists "admin all events"
  on events for all using (auth.role() = 'authenticated');

-- ── PHOTOS ──────────────────────────────────────────────────
create table if not exists photos (
  id           uuid primary key default gen_random_uuid(),
  storage_path text,
  url          text,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

alter table photos enable row level security;
create policy if not exists "public read photos"
  on photos for select using (true);
create policy if not exists "admin all photos"
  on photos for all using (auth.role() = 'authenticated');

-- ── INQUIRIES ───────────────────────────────────────────────
create table if not exists inquiries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  email          text not null,
  reason         text not null check (reason in ('volunteer','book_event','donate','general','other')),
  preferred_date date,
  comments       text,
  status         text default 'new' check (status in ('new','read','responded')),
  ip_address     text,
  created_at     timestamptz default now()
);

alter table inquiries enable row level security;
create policy if not exists "public insert inquiries"
  on inquiries for insert with check (true);
create policy if not exists "admin all inquiries"
  on inquiries for all using (auth.role() = 'authenticated');

-- ── STORAGE BUCKET ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('gallery', 'gallery', true)
  on conflict do nothing;

create policy if not exists "public read gallery"
  on storage.objects for select using (bucket_id = 'gallery');
create policy if not exists "admin upload gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy if not exists "admin delete gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ── LIKHAN BHAGTI SIGNUPS ───────────────────────────────────
create table if not exists likhanbhagti_signups (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  age             integer,
  age_group       text check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above')),
  simran_times    integer,
  parent_name     text,
  phone           text not null,
  email           text,
  city            text,
  province        text,
  country         text default 'Canada',
  contact_consent boolean default false,
  created_at      timestamptz default now()
);

alter table likhanbhagti_signups enable row level security;
create policy if not exists "public insert signups"
  on likhanbhagti_signups for insert to anon with check (true);
create policy if not exists "auth full access signups"
  on likhanbhagti_signups for all to authenticated using (true);

-- ── LIKHAN BHAGTI FAMILY MEMBERS ────────────────────────────
create table if not exists likhanbhagti_members (
  id           uuid primary key default gen_random_uuid(),
  signup_id    uuid references likhanbhagti_signups(id) on delete cascade,
  full_name    text not null,
  age          integer,
  age_group    text check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above')),
  simran_times integer,
  created_at   timestamptz default now()
);

alter table likhanbhagti_members enable row level security;
create policy if not exists "public insert members"
  on likhanbhagti_members for insert to anon with check (true);
create policy if not exists "auth full access members"
  on likhanbhagti_members for all to authenticated using (true);

-- ── DUPLICATE PHONE CHECK FUNCTION ──────────────────────────
create or replace function check_lb_phone_exists(p_phone text)
returns boolean language sql security definer as $$
  select exists (
    select 1 from likhanbhagti_signups where phone = p_phone
  );
$$;

-- ── SEED GURPURABS ──────────────────────────────────────────
insert into events (name, date, is_gurpurab, is_recurring) values
  ('Gurpurab — Guru Nanak Dev Ji',        '2025-11-05', true, true),
  ('Shaheedi Diwas — Baba Deep Singh Ji', '2025-11-13', true, true),
  ('Gurpurab — Guru Gobind Singh Ji',     '2026-01-06', true, true),
  ('Baisakhi — Khalsa Sajna Diwas',       '2026-04-14', true, true),
  ('Gurpurab — Guru Nanak Dev Ji',        '2026-11-24', true, true),
  ('Shaheedi Diwas — Baba Deep Singh Ji', '2026-11-13', true, true)
on conflict do nothing;
