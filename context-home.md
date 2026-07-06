# Home Page — Context

## Purpose
Landing page. Built last, after all individual pages are complete. Mobile-first — majority of users are on phone.

## Physical Location
**14210/14212 88 Ave, Surrey, BC V3W 3L7, Canada**

---

## Section 1 — Hero (full viewport, top of page)

- Background: same rotating photo carousel as Media gallery (same Supabase photo pool — one source of truth)
- Overlay: semi-transparent dark blue overlay on carousel for text legibility
- Overlaid content:
  - PNG/image of **Baba Deep Singh Ji** (iconic portrait) — positioned right or center
  - **Organisation name** — large, bold, bilingual:
    - English: e.g. "Chaupehra Baba Deep Singh Ji"
    - Punjabi (Gurmukhi): ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ
  - Tagline in English below
- CTA buttons: "Learn More" (→ About), "Watch Live" (→ Media), "Contact Us" (→ Contact section on same page)
- Language toggle: top-right corner, persistent across all pages — EN | ਪੰਜਾਬੀ

---

## Section 2 — About Snippet

- Short 2–3 sentence intro pulled from the About page copy
- Ends with a **"Read the Full Story →"** link to `/about`
- Minimal — just enough to give a newcomer context

---

## Section 3 — Upcoming Events Preview

- Shows next **3 upcoming events** from the events DB (same query as Events page, limited to 3)
- Each row: event name, date, start–end time
- **"View Full Schedule →"** link to `/events`
- If no events in next 30 days: show a simple "No upcoming events" message

---

## Section 4 — Media Preview (two columns, side by side)

### Left — YouTube Live / Latest Stream
- Thumbnail of latest YouTube stream
- "LIVE" badge if currently streaming
- Tapping opens the **Media page** (not YouTube directly) — keeps users on site
- Label: "Watch Live" or "Latest Stream"

### Right — Photo Gallery Preview
- 2–3 static preview thumbnails from the gallery
- Tapping opens the **Media page**, scrolled to the gallery section
- Label: "Photo Gallery"

Mobile: stacks vertically (stream on top, gallery below)

---

## Section 5 — Contact & Location

- Same contact form as `/contact` page (name, phone, email, reason dropdown, conditional date, comments)
- Same rate limiting (3 submissions per IP per 24h)
- Below the form: location block
  - Address: 14210/14212 88 Ave, Surrey, BC V3W 3L7
  - **"Open in Maps"** button — links to `https://maps.apple.com/?q=...` with a fallback to Google Maps
  - On Android: deep links to Google Maps; on iOS: Apple Maps. Use a universal maps link or detect platform.
- No embedded Google Maps iframe (privacy, performance) — just a clean address + open-in-maps CTA

---

## Global / Cross-Page Elements

### Navigation (sticky top bar)
- Logo / name left
- Nav links: Home · About · Events · Media · Contact
- Language toggle: EN | ਪੰਜਾਬੀ (top right)
- Mobile: hamburger menu — full-screen overlay nav (large text, easy to tap)

### Language Toggle Behaviour
- Switches UI text between English and Punjabi (Gurmukhi)
- Some content always bilingual regardless of toggle:
  - Organisation name in hero
  - Key Gurmat quotes on About page
  - Form success/error messages
- Language preference saved to localStorage

### Footer
- Social links (Facebook, Instagram, YouTube, WhatsApp, TikTok)
- Address
- Quick nav links
- Copyright

---

## Mobile-First Notes
- Base font: 18px minimum
- All tap targets: minimum 48px height
- No hover-only interactions — everything accessible by touch
- Form inputs: large, full-width, no tiny dropdowns
- Maps button: large, obvious
- Carousel: swipeable on touch

---

## Build Order (confirmed)
1. About
2. Events
3. Media
4. Contact
5. Home (last — aggregates content from all pages)
6. Admin Dashboard (after all public pages complete)
