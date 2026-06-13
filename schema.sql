-- Run this in your Supabase project's SQL Editor (supabase.com → your project → SQL Editor)

-- ── EVENTS ──────────────────────────────────────────────────────────────────
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null,
  time_start  time,
  time_end    time,
  venue       text,
  description text,
  is_published boolean default true,
  created_at  timestamptz default now()
);

-- ── PHOTOS ──────────────────────────────────────────────────────────────────
create table if not exists photos (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,
  caption       text,
  display_order integer default 0,
  created_at    timestamptz default now()
);

-- ── AVAILABLE DATES (for booking calendar) ──────────────────────────────────
create table if not exists available_dates (
  id           uuid primary key default gen_random_uuid(),
  date         date not null unique,
  is_available boolean default true,
  notes        text,
  created_at   timestamptz default now()
);

-- ── BOOKINGS ─────────────────────────────────────────────────────────────────
create table if not exists bookings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  event_date  date not null,
  event_type  text,
  message     text,
  status      text default 'pending' check (status in ('pending','confirmed','declined')),
  created_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table events         enable row level security;
alter table photos         enable row level security;
alter table available_dates enable row level security;
alter table bookings       enable row level security;

-- Public: read published events
create policy "public read events"
  on events for select using (is_published = true);

-- Public: read photos
create policy "public read photos"
  on photos for select using (true);

-- Public: read available dates
create policy "public read available_dates"
  on available_dates for select using (true);

-- Public: insert bookings (anyone can book)
create policy "public insert bookings"
  on bookings for insert with check (true);

-- Admin (authenticated): full access to all tables
create policy "admin all events"
  on events for all using (auth.role() = 'authenticated');

create policy "admin all photos"
  on photos for all using (auth.role() = 'authenticated');

create policy "admin all available_dates"
  on available_dates for all using (auth.role() = 'authenticated');

create policy "admin all bookings"
  on bookings for all using (auth.role() = 'authenticated');

-- ── STORAGE BUCKET ───────────────────────────────────────────────────────────
-- Run separately in Storage tab: create a bucket named "gallery" set to PUBLIC
-- Or run this:
insert into storage.buckets (id, name, public)
  values ('gallery', 'gallery', true)
  on conflict do nothing;

create policy "public read gallery"
  on storage.objects for select using (bucket_id = 'gallery');

create policy "admin upload gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "admin delete gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');
