-- ============================================================
-- Add link_url to events + register Likhan Bhagti as a real event
-- Run in: Supabase Dashboard → SQL Editor (or via CLI)
-- Safe to re-run (idempotent)
-- ============================================================

-- ── Add optional link column for events with their own page ──
alter table events add column if not exists link_url text;

-- ── Register Waheguru Likhan Bhagti Samgam as an event ──
insert into events (name, date, start_time, end_time, notes, is_published, link_url)
select
  '5th Annual Waheguru Likhan Bhagti Samgam',
  '2026-09-25',
  '16:30',
  '18:00',
  'Award Ceremony — Surrey, BC. Notebook submission deadline Sept 13, 2026 at Gurdwara Nanaksar Sahib.',
  true,
  'likhanbhagti.html'
where not exists (
  select 1 from events where link_url = 'likhanbhagti.html'
);
