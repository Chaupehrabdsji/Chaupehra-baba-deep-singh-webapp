# UI Design System — Chaupehra Baba Deep Singh Ji

## Colour Palette

```css
--color-saffron:      #FF9933;   /* Primary — Sikh saffron, CTAs, headings, accents */
--color-saffron-dark: #CC7700;   /* Hover state for saffron buttons */
--color-saffron-glow: #FF993333; /* Saffron at 20% opacity — subtle glows/highlights */

--color-navy:         #0D1B2A;   /* Primary dark background */
--color-navy-mid:     #132234;   /* Cards, panels, slightly lighter than base */
--color-navy-light:   #1E3350;   /* Borders, dividers, hover states on dark bg */

--color-white:        #FFFFFF;   /* Primary text on dark backgrounds */
--color-off-white:    #F5F0E8;   /* Warm off-white — body text, slightly softer */
--color-muted:        #A0AEC0;   /* Secondary text, captions, metadata */

--color-success:      #48BB78;   /* Form success */
--color-error:        #FC8181;   /* Form errors */

/* Always-bilingual text — Gurmukhi */
--color-gurmukhi:     #FFD580;   /* Warm gold — distinguishes Punjabi text visually */
```

## Typography

### Fonts
- **Headings:** Poppins (Google Fonts) — weights 600, 700
- **Body:** Poppins — weight 400, 500
- **Gurmukhi (Punjabi):** Noto Sans Gurmukhi (Google Fonts) — weight 400, 600
- Load both via single `<link>` in `<head>`

### Scale (mobile-first, rem-based)
```css
--text-xs:   0.875rem;  /* 14px — captions, badges */
--text-sm:   1rem;      /* 16px — metadata, secondary */
--text-base: 1.125rem;  /* 18px — body text minimum */
--text-lg:   1.25rem;   /* 20px — emphasized body */
--text-xl:   1.5rem;    /* 24px — subheadings */
--text-2xl:  2rem;      /* 32px — section headings */
--text-3xl:  2.75rem;   /* 44px — page titles */
--text-4xl:  3.5rem;    /* 56px — hero title */
```

### Rules
- Body text: never below 18px
- Line height: 1.7 for body, 1.2 for headings
- Letter spacing: -0.02em for large headings (tighter = more impact)
- Gurmukhi text: always 1.1× the size of adjacent English text (script is denser)

## Spacing System
```css
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
```

## Components

### Buttons
```
Primary (saffron):
  bg: #FF9933  |  text: #0D1B2A  |  font-weight: 700
  padding: 14px 28px  |  border-radius: 6px
  hover: bg #CC7700
  min-height: 52px (touch target)

Secondary (outline):
  bg: transparent  |  border: 2px solid #FF9933  |  text: #FF9933
  same padding/radius/height
  hover: bg #FF993320
```

### Navigation (sticky)
- Background: `#0D1B2A` with subtle bottom border `#1E3350`
- Logo left, nav links centre (desktop), hamburger right (mobile)
- Active link: saffron underline or saffron text
- Language toggle: pill button top-right — `EN | ਪੰਜਾਬੀ`
- Mobile: full-screen overlay, large text (24px), generous spacing

### Cards / Panels
- Background: `#132234`
- Border: 1px solid `#1E3350`
- Border-radius: 8px
- Padding: 24px
- No drop shadows — use border instead (cleaner on dark bg)

### Section Layout
- Max content width: 1100px, centered
- Section padding: 96px vertical (desktop), 64px (mobile)
- Section title: always bold, saffron colour, large (--text-3xl), top of section
- Thin saffron rule (2px line) under section titles as accent

### Forms
- Input background: `#132234`
- Input border: 1px solid `#1E3350`
- Input border (focus): 2px solid `#FF9933`
- Input text: `#F5F0E8`
- Label: above input, `#A0AEC0`, 14px
- Input padding: 14px 16px
- Border-radius: 6px
- All inputs full-width
- Min-height: 52px

### Event Row
```
[ Date header — bold saffron, 18px ]
  ├ [ Event name — white, 20px bold ]    [ Time — muted ]
  └ [ Path / Kirtani — muted, 16px ]
```
Thin left border in saffron on each event row.

### Page Title Block
Every page (except Home) opens with:
- Full-width dark band
- Page title: --text-4xl, Poppins 700, white
- Punjabi subtitle below: --text-2xl, Noto Sans Gurmukhi, --color-gurmukhi
- Saffron underline accent

## Accessibility Rules
- All text on dark bg: contrast ratio ≥ 4.5:1 (WCAG AA)
- All interactive elements: min 48px tap target
- Focus states: visible 2px saffron outline
- No colour-only information (always pair with text/icon)
- `aria-label` on all icon-only buttons
- Form fields: `<label>` always associated with `for` attribute
- Images: meaningful `alt` text always

## Motion / Animation
- Parallax (About page): CSS `background-attachment: fixed` with JS scroll fallback for iOS
- Carousel: CSS transitions, 0.4s ease
- Page transitions: none — keep it simple for older audience
- Reduced motion: `@media (prefers-reduced-motion: reduce)` — disable all transitions

## Language Toggle Implementation
```js
// localStorage key: 'lang' — values: 'en' | 'pa'
// Elements with both languages:
//   data-en="English text" data-pa="ਪੰਜਾਬੀ ਟੈਕਸਟ"
// On toggle: set textContent from data attribute, swap font-family for .gurmukhi class
```

## File Structure
```
chaupehra-website/
├── index.html          (Home)
├── about.html
├── events.html
├── media.html
├── contact.html
├── admin/
│   └── index.html
├── css/
│   ├── global.css      (variables, reset, typography, components)
│   ├── about.css
│   ├── events.css
│   ├── media.css
│   ├── contact.css
│   └── home.css
├── js/
│   ├── global.js       (nav, language toggle, shared utils)
│   ├── about.js        (parallax scroll)
│   ├── events.js       (fetch + render events)
│   ├── media.js        (YouTube API + carousel)
│   ├── contact.js      (form submission + rate limit)
│   └── home.js         (aggregates: events preview, media preview)
├── assets/
│   └── baba-deep-singh.png
├── supabase-config.js
└── db.js
```
