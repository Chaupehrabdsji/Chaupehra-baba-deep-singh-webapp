/* ============================================================
   CHAUPEHRA — Global JS: Nav, Language Toggle, Footer
   ============================================================ */

/* ── Language System ── */
const LANG_KEY = 'chaupehra_lang';

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLang(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = lang === 'pa' ? el.dataset.pa : el.dataset.en;
  });
  // Bilingual title: swap primary/secondary size on lang switch
  const primary   = document.querySelector('.page-title-primary');
  const secondary = document.querySelector('.page-title-secondary');
  if (primary && secondary) {
    if (lang === 'pa') {
      primary.classList.add('gurmukhi');
      secondary.classList.remove('gurmukhi');
    } else {
      primary.classList.remove('gurmukhi');
      secondary.classList.add('gurmukhi');
    }
  }
  document.documentElement.setAttribute('lang', lang === 'pa' ? 'pa' : 'en');
}

/* ── Nav ── */
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay   = document.querySelector('.nav-overlay');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-overlay a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Language toggle listeners
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // Apply saved lang
  setLang(getLang());
}

/* ── Rate limiting helper (client side) ── */
function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  const recent = stored.filter(t => now - t < windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  return true;
}

/* ── Format date helper ── */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/* ── Nav HTML (injected into every page) ── */
function renderNav() {
  const navHTML = `
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="Chaupehra Baba Deep Singh Ji - Home">
      <span class="nav-logo-en" data-en="Chaupehra Baba Deep Singh Ji" data-pa="ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ">Chaupehra Baba Deep Singh Ji</span>
      <span class="nav-logo-pa gurmukhi" data-en="ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ" data-pa="Chaupehra Baba Deep Singh Ji">ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="media.html">Media</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="likhanbhagti.html">Sign Up</a></li>
    </ul>
    <div class="nav-right">
      <div class="lang-toggle" role="group" aria-label="Language selection">
        <button class="lang-btn" data-lang="en" aria-label="English">EN</button>
        <button class="lang-btn gurmukhi" data-lang="pa" aria-label="Punjabi">ਪੰਜਾਬੀ</button>
      </div>
      <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div class="nav-overlay" role="dialog" aria-label="Navigation menu">
  <ul role="list">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="events.html">Events</a></li>
    <li><a href="media.html">Media</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="likhanbhagti.html">Sign Up</a></li>
  </ul>
  <div class="lang-toggle" role="group" aria-label="Language selection">
    <button class="lang-btn" data-lang="en">EN</button>
    <button class="lang-btn gurmukhi" data-lang="pa">ਪੰਜਾਬੀ</button>
  </div>
</div>`;
  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.outerHTML = navHTML;
}

/* ── Footer HTML ── */
function renderFooter() {
  const footerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo">
          Chaupehra Baba Deep Singh Ji
          <span class="gurmukhi">ਚੌਪਹਿਰਾ ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ</span>
        </div>
        <p>A Sikh community organisation in Surrey, BC, Canada, dedicated to the memory and legacy of Baba Deep Singh Ji Shaheed.</p>
      </div>
      <div>
        <p class="footer-heading">Quick Links</p>
        <ul class="footer-links">
          <li><a href="about.html">About</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="media.html">Media</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-heading">Connect</p>
        <div class="footer-socials">
          <a href="https://www.instagram.com/chaupehrabdsjicanada" class="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener" id="footer-instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            <span>Instagram</span>
          </a>
          <a href="https://www.youtube.com/@chaupehrabdsjicanada" class="footer-social-link" aria-label="YouTube" target="_blank" rel="noopener" id="footer-youtube">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--navy)"/></svg>
            <span>YouTube</span>
          </a>
          <a href="https://chat.whatsapp.com/EkU3Wwc0lcnKmjEbypDR3w" class="footer-social-link" aria-label="WhatsApp" target="_blank" rel="noopener" id="footer-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="https://www.tiktok.com/@chaupehrabdsjicanada" class="footer-social-link" aria-label="TikTok" target="_blank" rel="noopener" id="footer-tiktok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>
            <span>TikTok</span>
          </a>
        </div>
        <a href="https://maps.google.com/?q=14210+88+Ave+Surrey+BC+V3W+3L7" target="_blank" rel="noopener"
           class="text-muted mt-4 footer-address" style="font-size:var(--text-sm); display:block;">
          14210/14212 88 Ave<br>Surrey, BC V3W 3L7<br>Canada
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} Chaupehra Baba Deep Singh Ji. Surrey, BC, Canada.</p>
      <p style="margin-top:var(--space-2);font-size:var(--text-xs);color:var(--muted);">
        <a href="privacy.html" style="color:var(--muted);text-decoration:underline;">Privacy &amp; Consent Notice</a>
      </p>
    </div>
  </div>
</footer>`;
  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) placeholder.outerHTML = footerHTML;
}

/* ── Recurring Chaupehra Sahib live indicator ── */
function initRecurringBadge() {
  const badges = document.querySelectorAll('[id^="recurring-badge-"]');
  if (!badges.length) return;
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const min  = now.getMinutes();
  const mins = hour * 60 + min;
  const isWeekend = day === 0 || day === 6;
  const isLive    = isWeekend && mins >= 720 && mins < 960; // 12:00–16:00

  badges.forEach(badge => {
    if (isLive) {
      const link = document.createElement('a');
      link.href = 'media.html#livestream';
      link.textContent = '● LIVE NOW';
      link.className = badge.className + ' recurring-badge--live';
      link.id = badge.id;
      link.style.cssText = 'text-decoration:none;cursor:pointer;';
      badge.replaceWith(link);
    } else {
      badge.textContent = 'Saturday & Sunday';
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  initNav();
  initRecurringBadge();
});
