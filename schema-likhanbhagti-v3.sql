-- ── LIKHAN BHAGTI — v3: align with Canada Google Form (run in Supabase SQL Editor) ──
-- Drop old columns that are no longer collected
alter table likhanbhagti_signups
  drop column if exists father_name,
  drop column if exists age,
  drop column if exists is_whatsapp,
  drop column if exists address,
  drop column if exists email;

-- Add simran_times (the "how many times" answer)
alter table likhanbhagti_signups
  add column if not exists simran_times integer;

-- Update age_group check constraint to match 3 new options
alter table likhanbhagti_signups
  drop constraint if exists likhanbhagti_signups_age_group_check;

alter table likhanbhagti_signups
  add constraint likhanbhagti_signups_age_group_check
  check (age_group in ('3_7','8_16','above_16'));
