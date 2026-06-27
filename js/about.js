/* ── About page: subtle parallax on scroll (iOS-safe) ── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // iOS doesn't support background-attachment:fixed — use JS parallax instead
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const bgs = document.querySelectorAll('.act-bg');

  if (isIOS) {
    // Remove CSS fixed attachment; do it via transform
    bgs.forEach(bg => { bg.style.backgroundAttachment = 'scroll'; });
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          bgs.forEach(bg => {
            const rect = bg.parentElement.getBoundingClientRect();
            const progress = -rect.top / window.innerHeight;
            bg.style.transform = `scale(1.1) translateY(${progress * 30}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
