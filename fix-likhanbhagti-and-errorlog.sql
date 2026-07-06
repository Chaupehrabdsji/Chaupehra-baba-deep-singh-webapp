-- ============================================================
-- FIX: Likhan Bhagti signup errors + add error_logs table
-- Run in: Supabase Dashboard → SQL Editor (once)
-- Safe to re-run (idempotent — every statement is guarded)
-- ============================================================

-- ── 1. Add missing columns to likhanbhagti_signups ─────────
-- Root cause of "signup gives an error": this table was created
-- before columns were added to schema.sql, so the live table is
-- missing them. `create table if not exists` does NOT add columns
-- to an existing table, so schema.sql alone can't fix this.
alter table likhanbhagti_signups add column if not exists age integer;
alter table likhanbhagti_signups add column if not exists age_group text
  check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above'));
alter table likhanbhagti_signups add column if not exists simran_times integer;
alter table likhanbhagti_signups add column if not exists parent_name text;
alter table likhanbhagti_signups add column if not exists email text;
alter table likhanbhagti_signups add column if not exists city text;
alter table likhanbhagti_signups add column if not exists province text;
alter table likhanbhagti_signups add column if not exists country text default 'Canada';
alter table likhanbhagti_signups add column if not exists contact_consent boolean default false;

-- ── 2. Add missing columns to likhanbhagti_members (same drift) ──
alter table likhanbhagti_members add column if not exists age integer;
alter table likhanbhagti_members add column if not exists age_group text
  check (age_group in ('6_under','7_9','9_12','13_15','16_20','21_above'));
alter table likhanbhagti_members add column if not exists simran_times integer;

-- ── 3. Force PostgREST to refresh its schema cache ─────────
notify pgrst, 'reload schema';

-- ── 4. ERROR LOGS ───────────────────────────────────────────
create table if not exists error_logs (
  id           uuid primary key default gen_random_uuid(),
  source       text not null,              -- e.g. 'likhanbhagti_signup', 'contact_form'
  message      text not null,
  details      jsonb,                      -- raw error object / payload for debugging
  page_url     text,
  user_agent   text,
  created_at   timestamptz default now()
);

alter table error_logs enable row level security;

drop policy if exists "public insert error_logs" on error_logs;
create policy "public insert error_logs"
  on error_logs for insert to anon with check (true);

drop policy if exists "auth read error_logs" on error_logs;
create policy "auth read error_logs"
  on error_logs for select to authenticated using (true);

drop policy if exists "auth delete error_logs" on error_logs;
create policy "auth delete error_logs"
  on error_logs for delete to authenticated using (true);
