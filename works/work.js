/* 汐奎攝影 — Work Detail Page JS */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Lightbox ── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');

  const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
  const total = galleryImgs.length;
  let current = 0;

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

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  /* ── Reveal on scroll ── */
  const revealEls = document.querySelectorAll('.work-story-inner, .work-story-text p, .story-title');
  const obs = new IntersectionObserver(function (entries) {
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
