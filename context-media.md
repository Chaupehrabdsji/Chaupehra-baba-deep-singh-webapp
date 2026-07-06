# Media Page — Context

## Purpose
Central hub for live/recorded streams and photo gallery. No user interaction — read-only public page.

---

## Section 1 — Live Stream / Latest Stream (top of page)

### Layout
- Full-width embedded YouTube player at the top
- Shows either: current live stream (if live) OR most recent past stream
- Below the main player: 2 smaller thumbnails side-by-side — 2nd and 3rd most recent streams — these are links to YouTube (not embedded players)

### Auto-update via YouTube Data API
- Fetches the 3 most recent streams (live or completed) from the Chaupehra YouTube channel automatically
- Admin never manually updates this section — it pulls from YouTube on page load
- If a stream is currently live: main player shows the live feed with a "LIVE" badge
- If no active live stream: main player shows last recorded stream
- Requires: YouTube Data API v3 key + Chaupehra YouTube Channel ID

### YouTube Subscribe CTA
- Below the 3 streams: YouTube subscribe button + channel link
- Simple, large button — audience is older and may not know how to find the channel independently

---

## Section 2 — Photo Gallery (below streams)

### Layout
- Rotating carousel / slideshow — autoplay, smooth transition
- Full-width or wide-container
- Large images, minimal UI chrome — just prev/next arrows and dot indicators
- Autoplay pauses on hover/touch (accessibility)

### Admin Controls (dashboard)
- Upload photos to gallery (Supabase storage bucket)
- Remove photos
- Optionally reorder photos
- No categories needed — single flat gallery

### Photo specs
- Admin uploads from dashboard
- Images stored in Supabase `gallery` storage bucket (already exists from old schema)
- Public read access

---

## Data / API Summary

| Feature | Source |
|---|---|
| Latest stream embed | YouTube Data API v3 — most recent video/live from channel |
| 2nd & 3rd streams | YouTube Data API v3 — links only |
| Live badge | YouTube API `liveBroadcastContent: "live"` field |
| Photos | Supabase `gallery` bucket, `photos` table |

## Required Credentials
- YouTube Data API v3 key (Google Cloud Console)
- Chaupehra YouTube Channel ID
- Supabase project URL + anon key (already in use)

---

## Design Notes
- "LIVE" badge: red pill badge on the main player when streaming
- Stream thumbnails: dark background, orange title text, clean
- Gallery carousel: full-width, large images, minimal controls
- Subscribe button: prominent, orange, large tap target (older audience)
