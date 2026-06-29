-- ── LIKHAN BHAGTI v4 — full rebuild (run in Supabase SQL Editor) ──────────────

-- Drop old constraint so we can recreate cleanly
alter table likhanbhagti_signups
  drop constraint if exists likhanbhagti_signups_age_group_check;

-- Add new columns (safe — skips if already exists)
alter table likhanbhagti_signups
  add column if not exists email            text,
  add column if not exists city             text,
  add column if not exists province         text,
  add column if not exists country          text default 'Canada',
  add column if not exists simran_times     integer,
  add column if not exists parent_name      text,
  add column if not exists contact_consent  boolean default false;

-- Restore age_group check with all 6 original values
alter table likhanbhagti_signups
  add constraint likhanbhagti_signups_age_group_check
  check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above'));

-- Family members table (linked to primary registration)
create table if not exists likhanbhagti_members (
  id          uuid primary key default gen_random_uuid(),
  signup_id   uuid references likhanbhagti_signups(id) on delete cascade,
  full_name   text not null,
  age         integer,
  age_group   text check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above')),
  simran_times integer,
  created_at  timestamptz default now()
);

-- RLS for members table
alter table likhanbhagti_members enable row level security;
create policy "public insert members" on likhanbhagti_members for insert to anon with check (true);
create policy "auth full access members" on likhanbhagti_members for all to authenticated using (true);

-- Function to check for duplicate phone
create or replace function check_lb_phone_exists(p_phone text)
returns boolean language sql security definer as $$
  select exists (
    select 1 from likhanbhagti_signups where phone = p_phone
  );
$$;
