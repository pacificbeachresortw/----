/* 汐奎攝影 — Work Detail Page JS */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Page transition overlay ── */
  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:#000',
    'z-index:99999', 'pointer-events:none',
    'opacity:1', 'transition:none'
  ].join(';');
  document.body.appendChild(overlay);

  // Fade in on page load
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.transition = 'opacity 0.7s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.style.pointerEvents = 'none'; }, 750);
    });
  });

  // Intercept all internal links (back buttons)
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.style.pointerEvents = 'all';
      overlay.style.transition = 'opacity 0.5s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.opacity = '1';
      setTimeout(function () { window.location.href = href; }, 520);
    });
  });

  /* ── Lightbox ── */
  var lightbox  = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lbImg');
  var lbClose   = document.getElementById('lbClose');
  var lbPrev    = document.getElementById('lbPrev');
  var lbNext    = document.getElementById('lbNext');
  var lbCounter = document.getElementById('lbCounter');

  var galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
  var total = galleryImgs.length;
  var current = 0;

  function openLightbox(idx) {
    current = idx;
    lbImg.src = galleryImgs[idx].src;
    lbImg.alt = galleryImgs[idx].alt;
    lbCounter.textContent = (idx + 1) + ' / ' + total;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 400);
  }

  function showPrev() {
    current = (current - 1 + total) % total;
    lbImg.style.opacity = '0';
    setTimeout(function () {
      lbImg.src = galleryImgs[current].src;
      lbCounter.textContent = (current + 1) + ' / ' + total;
      lbImg.style.opacity = '1';
    }, 200);
  }

  function showNext() {
    current = (current + 1) % total;
    lbImg.style.opacity = '0';
    setTimeout(function () {
      lbImg.src = galleryImgs[current].src;
      lbCounter.textContent = (current + 1) + ' / ' + total;
      lbImg.style.opacity = '1';
    }, 200);
  }

  galleryImgs.forEach(function (img, idx) {
    img.parentElement.addEventListener('click', function () {
      openLightbox(idx);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', showPrev);
  if (lbNext)  lbNext.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll('.work-story-inner, .work-story-text p, .story-title, .story-sub, .story-list');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    obs.observe(el);
  });

});
