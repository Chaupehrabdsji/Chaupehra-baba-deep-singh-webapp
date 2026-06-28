-- ── LIKHAN BHAGTI — add new columns (run in Supabase SQL Editor) ──────────────
alter table likhanbhagti_signups
  add column if not exists father_name text,
  add column if not exists age         integer,
  add column if not exists is_whatsapp boolean default false,
  add column if not exists address     text;
