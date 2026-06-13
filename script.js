import { getUpcomingEvents, getPhotos, getAvailableDates, submitBooking } from './db.js';

/* ── Translations ── */
const i18n = {
  en: {
    siteTitle:         "Chaupehra Baba Deep Singh Ji",
    navAbout:          "About",
    navEvents:         "Events",
    navMedia:          "Media",
    navGallery:        "Gallery",
    navResources:      "Resources",
    navNews:           "News",
    navSeva:           "Seva",
    navContact:        "Contact",
    heroTitle:         "Chaupehra Baba Deep Singh Ji",
    heroSub:           "Surrey, British Columbia · Kirtan · Seva · Sangat",
    heroBtn:           "Upcoming Events",
    aboutTitle:        "About Us",
    aboutGroupTitle:   "Our Group",
    aboutGroupText:    "Chaupehra Baba Deep Singh Ji is a Sikh kirtan group based at Gurdwara Nanaksar, Surrey, BC. We come together in the spirit of seva and simran — performing kirtan at Gurdwara Nanaksar and community events across the Lower Mainland.",
    aboutBDSTitle:     "Baba Deep Singh Ji",
    aboutBDSText:      "Baba Deep Singh Ji (1682–1757) was a revered Sikh scholar, soldier, and martyr. A devout student of Guru Gobind Singh Ji, he became head of the Shahid Misl and devoted his life to the protection of the Sikh faith, Gurbani, and the Harmandir Sahib. He is remembered as a symbol of unwavering courage and dedication.",
    eventsTitle:       "Upcoming Events",
    eventsNote:        "Join our WhatsApp group or newsletter for event announcements.",
    mediaTitle:        "Kirtan Recordings",
    mediaYT:           "View Full YouTube Channel",
    galleryTitle:      "Photo Gallery",
    resourcesTitle:    "Gurbani Resources",
    resSikhiMax:       "Search and read Gurbani with translations",
    resNitnem:         "Daily Nitnem Banis with audio",
    resSriGranth:      "Full Sri Guru Granth Sahib Ji online",
    resCustom:         "[Add your own resource or kirtan learning material]",
    newsTitle:         "Announcements",
    newsletterTitle:   "Stay Updated",
    newsletterSub:     "Get event announcements delivered to your inbox.",
    newsletterBtn:     "Subscribe",
    newsletterPlaceholder: "your@email.com",
    sevaTitle:         "Seva & Donations",
    sevaIntro:         "Your seva supports kirtan programs, instrument maintenance, sound equipment, and community outreach. Every contribution, big or small, is deeply appreciated. Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.",
    sevaEtransfer:     "E-Transfer",
    sevaEtransferDetail: "Send to: [your-etransfer@email.com]",
    sevaEtransferNote: "Please include your name and \"Seva\" in the message.",
    sevaPaypal:        "Donate via PayPal",
    sevaVolunteer:     "Volunteer Seva",
    sevaVolunteerDetail: "Want to help with sound, logistics, langar, or admin? Fill in the form below.",
    sevaVolunteerBtn:  "Sign Up",
    volunteerTitle:    "Join / Volunteer",
    volunteerIntro:    "We welcome sangat of all skill levels — musicians, organizers, youth, and anyone who wishes to serve.",
    formName:          "Full Name",
    formEmail:         "Email Address",
    formPhone:         "Phone Number (optional)",
    formRoleDefault:   "How would you like to serve?",
    formMessage:       "Tell us about yourself...",
    formSubmit:        "Submit",
    contactTitle:      "Contact Us",
    liveTitle:         "Live Kirtan Stream",
    liveSub:           "We go live on YouTube and TikTok during major smagams. Follow us to get notified.",
    liveYT:            "YouTube Live",
    liveFB:            "Facebook Live",
    liveTT:            "TikTok",
    footerLine1:       "Chaupehra Baba Deep Singh Ji · Surrey, BC",
    footerCopy:        "© 2026 Chaupehra Baba Deep Singh Ji. All rights reserved.",
    navBookings:       "Book Us",
    bookingsTitle:     "Book the Group",
    bookingsIntro:     "Want to invite us to perform kirtan at your gurdwara or smagam? We are based at Gurdwara Nanaksar, Surrey, BC. Check availability and submit a request below.",
    bookingsCalTitle:  "Available Dates",
    bookingsAvail:     "Available",
    bookingsBlocked:   "Unavailable",
    bookingsLoadingDates: "Loading available dates…",
    bookingsFormTitle: "Send a Booking Request",
    bookingsEventType: "Type of event",
    bookingsMsg:       "Additional details (venue, time, any requests)…",
    bookingSuccess:    "Request submitted! We'll be in touch soon. Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.",
    bookingError:      "Something went wrong. Please try again or contact us directly.",
  },
  pa: {
    siteTitle:         "ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ",
    navAbout:          "ਸਾਡੇ ਬਾਰੇ",
    navEvents:         "ਸਮਾਗਮ",
    navMedia:          "ਮੀਡੀਆ",
    navGallery:        "ਗੈਲਰੀ",
    navResources:      "ਸਰੋਤ",
    navNews:           "ਖ਼ਬਰਾਂ",
    navSeva:           "ਸੇਵਾ",
    navContact:        "ਸੰਪਰਕ",
    heroTitle:         "ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ",
    heroSub:           "ਸਰੀ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ · ਕੀਰਤਨ · ਸੇਵਾ · ਸੰਗਤ",
    heroBtn:           "ਆਉਣ ਵਾਲੇ ਸਮਾਗਮ",
    aboutTitle:        "ਸਾਡੇ ਬਾਰੇ",
    aboutGroupTitle:   "ਸਾਡਾ ਗਰੁੱਪ",
    aboutGroupText:    "ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ ਇੱਕ ਸਿੱਖ ਕੀਰਤਨ ਗਰੁੱਪ ਹੈ ਜੋ ਗੁਰਦੁਆਰਾ ਨਾਨਕਸਰ, ਸਰੀ, ਬੀ.ਸੀ. ਵਿੱਚ ਅਧਾਰਿਤ ਹੈ। ਅਸੀਂ ਸੇਵਾ ਅਤੇ ਸਿਮਰਨ ਦੀ ਭਾਵਨਾ ਨਾਲ ਗੁਰਦੁਆਰਾ ਨਾਨਕਸਰ ਅਤੇ ਸਮਾਗਮਾਂ ਵਿੱਚ ਕੀਰਤਨ ਕਰਦੇ ਹਾਂ।",
    aboutBDSTitle:     "ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ",
    aboutBDSText:      "ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ (1682–1757) ਇੱਕ ਮਹਾਨ ਸਿੱਖ ਵਿਦਵਾਨ, ਯੋਧਾ ਅਤੇ ਸ਼ਹੀਦ ਸਨ। ਉਹ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਦੇ ਸ਼ਰਧਾਲੂ ਸਿੱਖ ਸਨ ਅਤੇ ਸ਼ਹੀਦ ਮਿਸਲ ਦੇ ਮੁਖੀ ਬਣੇ। ਉਨ੍ਹਾਂ ਦਾ ਜੀਵਨ ਅਦੁੱਤੀ ਹਿੰਮਤ ਅਤੇ ਸਮਰਪਣ ਦੀ ਮਿਸਾਲ ਹੈ।",
    eventsTitle:       "ਆਉਣ ਵਾਲੇ ਸਮਾਗਮ",
    eventsNote:        "ਸਮਾਗਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਸਾਡੇ WhatsApp ਗਰੁੱਪ ਜਾਂ ਨਿਊਜ਼ਲੈਟਰ ਨਾਲ ਜੁੜੋ।",
    mediaTitle:        "ਕੀਰਤਨ ਰਿਕਾਰਡਿੰਗਾਂ",
    mediaYT:           "ਪੂਰਾ YouTube ਚੈਨਲ ਵੇਖੋ",
    galleryTitle:      "ਫੋਟੋ ਗੈਲਰੀ",
    resourcesTitle:    "ਗੁਰਬਾਣੀ ਸਰੋਤ",
    resSikhiMax:       "ਅਨੁਵਾਦ ਸਮੇਤ ਗੁਰਬਾਣੀ ਪੜ੍ਹੋ",
    resNitnem:         "ਰੋਜ਼ਾਨਾ ਨਿਤਨੇਮ ਬਾਣੀਆਂ ਆਡੀਓ ਸਮੇਤ",
    resSriGranth:      "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਔਨਲਾਈਨ",
    resCustom:         "[ਆਪਣਾ ਸਰੋਤ ਜੋੜੋ]",
    newsTitle:         "ਇਸ਼ਤਿਹਾਰ",
    newsletterTitle:   "ਖ਼ਬਰਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
    newsletterSub:     "ਸਮਾਗਮਾਂ ਦੀਆਂ ਸੂਚਨਾਵਾਂ ਆਪਣੇ ਈਮੇਲ ਤੇ ਪਾਓ।",
    newsletterBtn:     "ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ",
    newsletterPlaceholder: "ਤੁਹਾਡਾ ਈਮੇਲ",
    sevaTitle:         "ਸੇਵਾ ਅਤੇ ਦਾਨ",
    sevaIntro:         "ਤੁਹਾਡੀ ਸੇਵਾ ਕੀਰਤਨ ਪ੍ਰੋਗਰਾਮਾਂ, ਸਾਜ਼ਾਂ ਅਤੇ ਸਮੁਦਾਇਕ ਕੰਮਾਂ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ। ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ।",
    sevaEtransfer:     "ਈ-ਟ੍ਰਾਂਸਫਰ",
    sevaEtransferDetail: "ਭੇਜੋ: [your-etransfer@email.com]",
    sevaEtransferNote: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਅਤੇ 'ਸੇਵਾ' ਲਿਖੋ।",
    sevaPaypal:        "PayPal ਰਾਹੀਂ ਦਾਨ ਕਰੋ",
    sevaVolunteer:     "ਸੇਵਾਦਾਰ ਬਣੋ",
    sevaVolunteerDetail: "ਕੀ ਤੁਸੀਂ ਸਾਊਂਡ, ਲੌਜਿਸਟਿਕਸ, ਲੰਗਰ, ਜਾਂ ਐਡਮਿਨ ਵਿੱਚ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    sevaVolunteerBtn:  "ਨਾਮ ਦਰਜ ਕਰੋ",
    volunteerTitle:    "ਜੁੜੋ / ਸੇਵਾਦਾਰ ਬਣੋ",
    volunteerIntro:    "ਸਾਰੀ ਸੰਗਤ ਦਾ ਸੁਆਗਤ ਹੈ — ਰਾਗੀ, ਪ੍ਰਬੰਧਕ, ਨੌਜਵਾਨ, ਅਤੇ ਹਰ ਕੋਈ ਜੋ ਸੇਵਾ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹੈ।",
    formName:          "ਪੂਰਾ ਨਾਮ",
    formEmail:         "ਈਮੇਲ ਪਤਾ",
    formPhone:         "ਫੋਨ ਨੰਬਰ (ਵਿਕਲਪਿਕ)",
    formRoleDefault:   "ਤੁਸੀਂ ਕਿਵੇਂ ਸੇਵਾ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    formMessage:       "ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ...",
    formSubmit:        "ਜਮ੍ਹਾਂ ਕਰੋ",
    contactTitle:      "ਸੰਪਰਕ ਕਰੋ",
    liveTitle:         "ਲਾਈਵ ਕੀਰਤਨ",
    liveSub:           "ਅਸੀਂ ਵੱਡੇ ਸਮਾਗਮਾਂ ਦੌਰਾਨ YouTube ਅਤੇ TikTok ਤੇ ਲਾਈਵ ਆਉਂਦੇ ਹਾਂ।",
    liveYT:            "YouTube ਲਾਈਵ",
    liveFB:            "Facebook ਲਾਈਵ",
    liveTT:            "TikTok",
    footerLine1:       "ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ · ਸਰੀ, ਬੀ.ਸੀ.",
    footerCopy:        "© 2026 ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ। ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਅਤ।",
    navBookings:       "ਬੁਕਿੰਗ",
    bookingsTitle:     "ਗਰੁੱਪ ਬੁੱਕ ਕਰੋ",
    bookingsIntro:     "ਕੀ ਤੁਸੀਂ ਸਾਨੂੰ ਆਪਣੇ ਗੁਰਦੁਆਰੇ, ਸਮਾਗਮ ਜਾਂ ਪ੍ਰੋਗਰਾਮ ਲਈ ਸੱਦਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਉਪਲਬਧ ਤਾਰੀਖਾਂ ਵੇਖੋ ਅਤੇ ਬੇਨਤੀ ਭੇਜੋ।",
    bookingsCalTitle:  "ਉਪਲਬਧ ਤਾਰੀਖਾਂ",
    bookingsAvail:     "ਉਪਲਬਧ",
    bookingsBlocked:   "ਅਣਉਪਲਬਧ",
    bookingsLoadingDates: "ਤਾਰੀਖਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ…",
    bookingsFormTitle: "ਬੁਕਿੰਗ ਬੇਨਤੀ ਭੇਜੋ",
    bookingsEventType: "ਸਮਾਗਮ ਦੀ ਕਿਸਮ",
    bookingsMsg:       "ਹੋਰ ਵੇਰਵੇ (ਸਥਾਨ, ਸਮਾਂ, ਕੋਈ ਬੇਨਤੀ)…",
    bookingSuccess:    "ਬੇਨਤੀ ਭੇਜ ਦਿੱਤੀ ਗਈ! ਅਸੀਂ ਜਲਦ ਸੰਪਰਕ ਕਰਾਂਗੇ। ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ।",
    bookingError:      "ਕੁਝ ਗਲਤ ਹੋਇਆ। ਕਿਰਪਾ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  }
};

/* ── State ── */
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let updateCountdown = null;

/* ── Apply translations ── */
function applyLang(lang) {
  const t = i18n[lang];
  document.documentElement.lang = lang === 'pa' ? 'pa' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });

  if (updateCountdown) updateCountdown();

  const langBtn = document.getElementById('langToggle');
  langBtn.textContent = lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English';
  langBtn.style.fontFamily = lang === 'en'
    ? "'Noto Sans Gurmukhi', sans-serif"
    : "'Inter', sans-serif";

  localStorage.setItem('lang', lang);
  currentLang = lang;
}

/* ── Apply theme ── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

/* ── Nav hamburger ── */
document.getElementById('navToggle').addEventListener('click', () => {
  const navLinks = document.getElementById('navLinks');
  const btn = document.getElementById('navToggle');
  const isOpen = navLinks.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

/* Close nav on link click (mobile) */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── Language toggle ── */
document.getElementById('langToggle').addEventListener('click', () => {
  applyLang(currentLang === 'en' ? 'pa' : 'en');
});

/* ── Theme toggle ── */
document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
});

/* ── WhatsApp QR toggle ── */
const whatsappTrigger = document.querySelector('.whatsapp-trigger');
if (whatsappTrigger) {
  whatsappTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    const qr = document.getElementById('whatsapp-qr');
    if (qr) qr.style.display = qr.style.display === 'inline-block' ? 'none' : 'inline-block';
  });
}

/* ── Init ── */
applyLang(currentLang);
applyTheme(currentTheme);
loadEvents();
loadGallery();
loadAvailableDates();

/* ── Dynamic Events ─────────────────────────────────────────────────────── */
const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTHS_PA = ['ਜਨ','ਫਰ','ਮਾਰ','ਅਪ੍ਰ','ਮਈ','ਜੂਨ','ਜੁਲ','ਅਗ','ਸਤ','ਅਕ','ਨਵ','ਦਸ'];

async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  try {
    const events = await getUpcomingEvents();
    const months = currentLang === 'pa' ? MONTHS_PA : MONTHS_EN;
    if (!events.length) {
      grid.innerHTML = `<p class="events-loading" style="color:var(--text-sub)">No upcoming events. Check back soon.</p>`;
      return;
    }
    grid.innerHTML = events.map(ev => {
      const d = new Date(ev.date + 'T00:00:00');
      const month = months[d.getMonth()];
      const day   = d.getDate();
      const time  = ev.time_start
        ? `🕐 ${ev.time_start}${ev.time_end ? ' – ' + ev.time_end : ''}`
        : '';
      return `
        <div class="event-card">
          <div class="event-date">
            <span class="event-month">${month}</span>
            <span class="event-day">${day}</span>
          </div>
          <div class="event-info">
            <h3>${ev.title}</h3>
            ${ev.venue ? `<p>📍 ${ev.venue}</p>` : ''}
            ${time ? `<p>${time}</p>` : ''}
            ${ev.description ? `<p>${ev.description}</p>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch {
    grid.innerHTML = `<p class="events-loading" style="color:var(--text-sub)">Could not load events.</p>`;
  }
}

/* ── Dynamic Gallery ─────────────────────────────────────────────────────── */
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  try {
    const photos = await getPhotos();
    if (!photos.length) {
      grid.innerHTML = `<p class="gallery-loading" style="color:var(--text-sub)">No photos yet.</p>`;
      return;
    }
    grid.innerHTML = photos.map(p =>
      `<img src="${p.url}" alt="${p.caption ?? 'Kirtan photo'}" loading="lazy" />`
    ).join('');
  } catch {
    grid.innerHTML = `<p class="gallery-loading" style="color:var(--text-sub)">Could not load photos.</p>`;
  }
}

/* ── Available Dates & Booking ───────────────────────────────────────────── */
let availableDateSet = new Set();

async function loadAvailableDates() {
  const list = document.getElementById('availableDatesList');
  if (!list) return;
  try {
    const dates = await getAvailableDates();
    if (!dates.length) {
      list.innerHTML = `<p class="dates-loading">${i18n[currentLang].bookingsLoadingDates ?? 'No dates available yet.'}</p>`;
      return;
    }
    availableDateSet = new Set(dates.filter(d => d.is_available).map(d => d.date));
    list.innerHTML = dates.map(d => {
      const label = new Date(d.date + 'T00:00:00')
        .toLocaleDateString(currentLang === 'pa' ? 'pa-IN' : 'en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
      return `<button
        class="date-chip ${d.is_available ? 'available' : 'blocked'}"
        data-date="${d.date}"
        ${!d.is_available ? 'disabled aria-disabled="true"' : ''}
        type="button"
      >${label}</button>`;
    }).join('');
    list.querySelectorAll('.date-chip.available').forEach(chip => {
      chip.addEventListener('click', () => {
        list.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        const dateInput = document.getElementById('bk-date');
        if (dateInput) dateInput.value = chip.dataset.date;
      });
    });
  } catch { /* Supabase not configured */ }
}

/* Booking form submit */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('bookingStatus');
    const btn    = bookingForm.querySelector('[type="submit"]');
    const t      = i18n[currentLang];
    btn.disabled = true;
    status.textContent = '…';
    status.className = 'form-status';

    const date = document.getElementById('bk-date').value;
    if (date && !availableDateSet.has(date)) {
      status.textContent = currentLang === 'pa'
        ? 'ਇਹ ਤਾਰੀਖ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।'
        : 'That date is not available. Please choose an available date.';
      status.className = 'form-status error';
      btn.disabled = false;
      return;
    }

    try {
      await submitBooking({
        name:       document.getElementById('bk-name').value.trim(),
        email:      document.getElementById('bk-email').value.trim(),
        phone:      document.getElementById('bk-phone').value.trim() || null,
        event_date: date,
        event_type: document.getElementById('bk-type').value || null,
        message:    document.getElementById('bk-msg').value.trim() || null,
      });
      status.textContent = t.bookingSuccess;
      status.className = 'form-status success';
      bookingForm.reset();
      document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
    } catch {
      status.textContent = t.bookingError;
      status.className = 'form-status error';
    }
    btn.disabled = false;
  });
}

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.about-card, .event-card, .seva-card, .resource-card, .news-card, ' +
  '.video-wrap, .form-card, .newsletter-box, .section-title, ' +
  '.section-intro, .booking-grid, .contact-grid, .gallery-grid'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

document.querySelectorAll('.about-grid, .events-grid, .seva-grid, .resources-grid').forEach(el => {
  el.classList.add('stagger');
  revealObserver.observe(el);
});

/* ── Nav glass on scroll ── */
const nav = document.querySelector('.nav-bar');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hero particles ── */
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const particles = document.createElement('div');
  particles.className = 'hero-particles';
  particles.innerHTML = Array.from({ length: 10 }, () => '<span></span>').join('');
  heroEl.prepend(particles);
}

/* ── Countdown to next event ── */
(function () {
  const nextEvent = new Date('2026-07-12T18:00:00-07:00');
  const countdownEl = document.createElement('p');
  countdownEl.className = 'events-note';
  countdownEl.style.fontWeight = '600';
  countdownEl.style.color = 'var(--gold)';
  let timer = null;

  function update() {
    const diff = nextEvent - Date.now();
    if (diff <= 0) { countdownEl.textContent = ''; clearInterval(timer); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    countdownEl.textContent = currentLang === 'pa'
      ? `ਅਗਲਾ ਸਮਾਗਮ: ${d}ਦਿ ${h}ਘੰ ${m}ਮਿ`
      : `Next event in: ${d}d ${h}h ${m}m`;
  }

  const grid = document.getElementById('eventsGrid');
  if (grid) {
    grid.after(countdownEl);
    update();
    timer = setInterval(update, 30000);
    updateCountdown = update;
  }
})();
