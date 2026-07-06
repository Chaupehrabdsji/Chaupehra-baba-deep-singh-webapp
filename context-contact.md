# Contact Page — Context

## Purpose
Primary touchpoint for the public to reach the organisation. No phone/email displayed publicly — all inquiries routed through the form to the admin dashboard.

---

## Section 1 — Social Media Links (top of page)
Large, clearly labelled icon buttons — one per platform:
- **Facebook**
- **Instagram**
- **YouTube**
- **WhatsApp** (group link or direct)
- **TikTok**

Design: big icons with platform name label underneath. Older audience — no icon-only, always include text. Orange on dark blue background. Large tap targets (min 48px).

---

## Section 2 — Contact Form

### Fields
| Field | Type | Required |
|---|---|---|
| Full Name | Text input | Yes |
| Phone Number | Tel input | Yes |
| Email Address | Email input | Yes |
| Reason for Contact | Dropdown | Yes |
| Preferred Date | Date picker | Conditional — shown only if reason = "Book an Event" |
| Additional Comments | Textarea | No |

### Reason Dropdown Options
- Volunteer
- Book an Event
- Donate
- General Enquiry
- Other

### Conditional Logic
- If user selects **"Book an Event"** → a date picker field appears below the dropdown
- All other reasons → date field hidden

### Form Submission
- Stored in Supabase `inquiries` table
- Routed to **admin dashboard only** — admin reviews and responds manually
- Rate limiting: max **3 submissions per IP per 24 hours** (enforced server-side via Supabase Edge Function or a simple counter in DB)
- On submit: show a clear success message in both English and Punjabi
- No Formspree — all goes to Supabase

---

## Data Model
```
inquiries table:
- id
- name (string)
- phone (string)
- email (string)
- reason (enum: volunteer | book_event | donate | general | other)
- preferred_date (date, nullable — only for book_event)
- comments (text, nullable)
- status (enum: new | read | responded) — default: new
- ip_address (string) — for rate limiting
- created_at (timestamp)
```

---

## Design Notes
- Social icons: top of page, large, labelled, horizontal row
- Form: centered, max-width ~600px, large input fields (older audience)
- Labels above inputs, not placeholder-only (accessibility)
- Date picker: native HTML date input — simple and accessible
- Submit button: full-width, large, orange
- Success state: replace form with a friendly bilingual message
  - English: "Thank you. We will be in touch soon."
  - Punjabi: "ਧੰਨਵਾਦ। ਅਸੀਂ ਜਲਦੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਾਂਗੇ।"
- Error state: clear inline validation messages, not just red borders
