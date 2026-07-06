# Events Page — Context

## Purpose
Read-only public page. Shows the schedule for the **next 30 days** of events.

## Public View — List Layout
Each event row shows:
- **Event name**
- **Date**
- **Duration** — start time and end time
- **Additional details** — any path (e.g. Akhand Path, Sehaj Path), any special kirtani

One row per event. Clean list, no cards/grid. Date-sorted ascending.

## Event Types

### Recurring / Fixed (auto-populated yearly)
Gurpurabs — Sikh holy days that follow the Nanakshahi calendar and recur every year:
- Examples: Gurpurab of Guru Nanak Dev Ji, Gurpurab of Guru Gobind Singh Ji, Shaheedi Diwas of Baba Deep Singh Ji, Baisakhi, etc.
- These should be seeded into the DB automatically each year — admin should not need to manually re-enter them every year.
- Admin can still add additional details (path, kirtani) to a Gurpurab entry.

### Admin-Created Events (custom, one-off or recurring)
- Created from the admin dashboard
- Admin picks from **dropdown presets** for common event types (e.g. Chaupehra Sahib, Akhand Path, Kirtan Darbar, Seva Day, etc.)
- OR admin can fully customize all fields manually

## Admin Controls (for dashboard — to plan later)
- Add event: name (preset dropdown or custom), date, start time, end time
- Optional fields: path type, kirtani name, notes
- Edit / delete any event
- Gurpurabs pre-loaded but editable (can add details to them)

## Data Model (draft)
```
events table:
- id
- name (string)
- date (date)
- start_time (time)
- end_time (time)
- path_type (string, nullable) — e.g. "Akhand Path", "Sehaj Path"
- kirtani (string, nullable)
- notes (string, nullable)
- is_gurpurab (boolean) — auto-seeded yearly events
- created_at
```

## Answered Decisions

### Gurpurabs to pre-load yearly (expandable list — admin can add more recurring events later)
- Gurpurab Guru Nanak Dev Ji (November)
- Gurpurab Guru Gobind Singh Ji (January)
- Shaheedi Diwas Baba Deep Singh Ji (November 13)
- Baisakhi / Khalsa Sajna Diwas (April 14)
- Admin dashboard will have an option to designate any event as "recurring yearly"

### Multi-day events
- Supported — e.g. a 3-day Akhand Path
- DB model: `start_date`, `end_date` (same date = single day)
- Public view: shown once with "Day 1 of 3" style indicator or date range

### Display grouping
- Grouped by date — bold date header, events listed beneath it
- e.g.:
  ```
  Sunday, 15 June
    ├ Chaupehra Sahib — 9:00 AM to 1:00 PM
    └ Akhand Path Bhog — 6:00 PM to 8:00 PM
  ```

## Remaining Open Questions
1. Does the 30-day window roll (always today + 30 days) or is it a fixed calendar month view?
2. Should past events from today disappear immediately, or stay visible until end of day?
