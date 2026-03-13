/* 汐奎攝影 XIKUI PHOTOGRAPHY — Main JS */

document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     INTRO LOADER — Cinematic Multi-Phase Animation
     Phase1: Logo + counter sprint ~2.5s
     Phase2: Tagline + chars slam ~2.5s
     Phase3: Photo flash x12 w/ varied animations ~3s
     Outro:  Smooth fade reveal ~0.6s
     ============================================= */
  var introLoader = document.getElementById('introLoader');

  if (introLoader) {
    document.body.style.overflow = 'hidden';

    var phase1 = document.getElementById('introPhase1');
    var phase2 = document.getElementById('introPhase2');
    var phase3 = document.getElementById('introPhase3');
    var outro  = document.getElementById('introOutro');
    var fill   = document.getElementById('introFill');
    var numEl  = document.getElementById('introNum');
    var chars  = Array.from(document.querySelectorAll('.ibc'));
    var photos = Array.from(document.querySelectorAll('.intro-photo'));

    function showPhase(el) { if (el) el.classList.add('active'); }
    function hidePhase(el) { if (el) el.classList.remove('active'); }

    // Photo entry animations — each index gets a different style
    var photoAnimations = [
      { from: 'translateX(-6%) scale(1.06)',  to: 'translateX(0) scale(1)',   dur: '0.35s' },
      { from: 'translateX(6%) scale(1.06)',   to: 'translateX(0) scale(1)',   dur: '0.35s' },
      { from: 'translateY(-5%) scale(1.05)',  to: 'translateY(0) scale(1)',   dur: '0.3s'  },
      { from: 'translateY(5%) scale(1.05)',   to: 'translateY(0) scale(1)',   dur: '0.3s'  },
      { from: 'scale(1.12)',                  to: 'scale(1)',                  dur: '0.4s'  },
      { from: 'scale(0.92)',                  to: 'scale(1)',                  dur: '0.3s'  },
      { from: 'translateX(-8%) scale(1.04)',  to: 'translateX(0) scale(1)',   dur: '0.28s' },
      { from: 'translateX(8%) scale(1.04)',   to: 'translateX(0) scale(1)',   dur: '0.28s' },
      { from: 'scale(1.1) translateY(-3%)',   to: 'scale(1) translateY(0)',   dur: '0.35s' },
      { from: 'scale(1.08) translateX(3%)',   to: 'scale(1) translateX(0)',   dur: '0.32s' },
      { from: 'translateY(4%) scale(1.05)',   to: 'translateY(0) scale(1)',   dur: '0.3s'  },
      { from: 'scale(0.94) translateY(-4%)',  to: 'scale(1) translateY(0)',   dur: '0.35s' },
    ];

    /* ── PHASE 1: Logo + Counter (no white flash) ── */
    showPhase(phase1);

    var count = 0;
    var counterDuration = 1600;
    var counterStep = counterDuration / 100;

    setTimeout(function () {
      if (fill) {
        fill.style.transition = 'width ' + counterDuration + 'ms cubic-bezier(0.4,0,0.2,1)';
        fill.style.width = '100%';
      }
      var timer = setInterval(function () {
        count++;
        if (numEl) numEl.textContent = count;
        if (count >= 100) {
          clearInterval(timer);
          // Smooth fade out — NO white flash
          setTimeout(function () {
            phase1.style.transition = 'opacity 0.5s ease';
            phase1.style.opacity = '0';
            setTimeout(function () {
              hidePhase(phase1);
              phase1.style.opacity = '';
              phase1.style.transition = '';
              setTimeout(startPhase2, 200);
            }, 500);
          }, 300);
        }
      }, counterStep);
    }, 400);

    /* ── PHASE 2: Tagline + Chars ── */
    function startPhase2() {
      showPhase(phase2);
      chars.forEach(function (ch, i) {
        setTimeout(function () {
          ch.style.opacity = '1';
          ch.style.transform = 'translateY(0) scale(1)';
          ch.style.transition = 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)';
        }, 800 + i * 150);
      });
      var dur = 800 + chars.length * 150 + 800;
      setTimeout(function () {
        chars.forEach(function (ch) {
          ch.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.76,0,0.24,1)';
          ch.style.opacity = '0';
          ch.style.transform = 'translateY(-30px) scale(1.08)';
        });
        setTimeout(function () {
          hidePhase(phase2);
          setTimeout(startPhase3, 150);
        }, 350);
      }, dur);
    }

    /* ── PHASE 3: Fade-in / hold / fade-out per photo ── */
    function startPhase3() {
      showPhase(phase3);

      var photoNumEl = document.createElement('div');
      photoNumEl.className = 'intro-photo-num';
      var photoContainer = document.getElementById('introPhotos');
      if (photoContainer) photoContainer.appendChild(photoNumEl);

      var fadeInDur  = 300;   // ms fade in
      var holdDur    = 280;   // ms hold at full opacity
      var fadeOutDur = 220;   // ms fade out
      var totalPerPhoto = fadeInDur + holdDur + fadeOutDur;

      var idx = 0;

      function showNext() {
        if (idx >= photos.length) {
          setTimeout(startOutro, 400);
          return;
        }

        var photo = photos[idx];
        var anim  = photoAnimations[idx % photoAnimations.length];

        // Reset
        photo.style.transition = 'none';
        photo.style.opacity    = '0';
        photo.style.transform  = anim.from;
        photo.classList.add('visible');

        // Fade IN + slide
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            photo.style.transition = 'opacity ' + (fadeInDur/1000) + 's ease, transform ' + anim.dur + ' cubic-bezier(0.22,1,0.36,1)';
            photo.style.opacity    = '1';
            photo.style.transform  = anim.to;

            if (photoNumEl) {
              photoNumEl.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(photos.length).padStart(2,'0');
            }
          });
        });

        // Hold then FADE OUT
        setTimeout(function () {
          photo.style.transition = 'opacity ' + (fadeOutDur/1000) + 's ease';
          photo.style.opacity    = '0';

          // Next photo after fade out
          setTimeout(function () {
            photo.classList.remove('visible');
            photo.style.opacity   = '';
            photo.style.transform = '';
            photo.style.transition= '';
            idx++;
            showNext();
          }, fadeOutDur);
        }, fadeInDur + holdDur);
      }

      setTimeout(showNext, 80);
    }

    /* ── OUTRO: Fade black → reveal site with entrance animation ── */
    function startOutro() {
      if (outro) {
        // 1. Fade to black
        outro.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)';
        outro.style.pointerEvents = 'all';
        outro.classList.add('fade-in');

        setTimeout(function () {
          // 2. Hide loader, show site (still behind black outro)
          introLoader.classList.add('hidden');
          document.body.style.overflow = '';
          document.body.classList.add('site-enter');

          // 3. Fade out the black outro revealing site
          outro.style.transition = 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)';
          outro.classList.remove('fade-in');

        }, 520);
      } else {
        introLoader.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.add('site-enter');
      }
    }
  }

  /* ── Navbar scroll ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Mobile nav ── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  /* ── Contact form ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('訊息已送出，我們將盡快回覆您。');
      form.reset();
    });
  }
  function showToast(msg) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3500);
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
