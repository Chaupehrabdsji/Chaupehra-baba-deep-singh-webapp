# Chaupehra Baba Deep Singh Ji

Official website for Chaupehra Baba Deep Singh Ji, serving the Gurdwara-going Sikh community in Surrey, BC and across Canada.

Live at [chaupehrabdsji.ca](https://chaupehrabdsji.ca)

## Tech Stack

- Vanilla HTML / CSS / JS — no framework, no build step
- [Supabase](https://supabase.com) — database, auth, and storage
- Deployed on [Vercel](https://vercel.com)

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| Events | `events.html` |
| Media | `media.html` |
| Contact | `contact.html` |
| Likhan Bhagti signup | `likhanbhagti.html` |
| Admin dashboard | `admin/index.html` |

## Local Setup

1. Clone the repo.
2. Create `supabase-config.js` in the project root (gitignored, never committed):
   ```js
   const SUPABASE_URL  = 'https://your-project.supabase.co';
   const SUPABASE_ANON = 'your-anon-public-key';

   const YOUTUBE_CHANNEL_ID = 'your-youtube-channel-id';
   const YOUTUBE_API_KEY    = 'your-youtube-api-key';

   export { SUPABASE_URL, SUPABASE_ANON, YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY };
   ```
3. Apply the database schema from `migrations/` to your Supabase project, in numeric order.
4. Serve the folder with any static file server, e.g.:
   ```bash
   npx serve .
   ```

## Database

Schema and migrations live in [`migrations/`](migrations/), applied in numeric order starting with `001_schema.sql`.

## Design Principles

Built for an older, less tech-savvy audience — accessibility and readability come first:

- High contrast, large tap targets, large base font size (18px+)
- English primary, with a quick-switch toggle to Punjabi (Gurmukhi script)
- Public form submissions are rate-limited and routed through the admin dashboard for review — no direct public writes to the database

## Security

Security headers (CSP, HSTS, X-Frame-Options, etc.) are configured in `vercel.json` and `_headers`.

## License

All rights reserved. This code is published for transparency and reference; please contact the organisation before reusing content or branding.
