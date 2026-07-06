# Chaupehra Website — Global Project Context

## Organisation
- Sikh community organisation serving Gurudwara-going Sikhs in Surrey & Canada
- Primary audience: older age, not very tech-savvy — **accessibility and readability are the top priority**

## Pages
1. Home
2. About
3. Events
4. Media
5. Contact

## Build Order
Build all individual pages first, then the Home page with links to all.
Each page gets its own `context-<page>.md` file.

## Tech Stack
- Vanilla HTML / CSS / JS (no framework)
- Supabase backend
- Netlify / Vercel deployment

## UI & Design
- **Colour palette:** Sikh orange (`#FF6600` or similar) + dark navy blue (`#1A2B4A` or similar)
- **Style:** Minimal but not bland — clean, spacious, dignified
- **Page titles:** Big and bold at the top of every page
- **Font:** Large base font size for readability (18px+)
- **Accessibility:** High contrast, large tap targets, clear labels, no small text

## Language
- Primary language: **English**
- Quick-switch toggle to **Punjabi (Gurmukhi script)**
- Some key content always shown in **both languages** (e.g. page title on Home)

## Security / Rate Limiting
- Limit public form submissions to avoid abuse
- Rate-limit by IP on any user-facing form or inquiry endpoint
- All public submissions route to the **admin dashboard** for review
- No direct public writes to DB without backend validation
