/* 汐奎攝影 XIKUI PHOTOGRAPHY — Main JS */

document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     INTRO LOADER — High-Impact Multi-Phase Animation
     Phase1: Logo flash in + counter sprint (0→100) ~2.5s
     Phase2: Tagline wipe + chars slam in ~2.5s
     Phase3: Photo rapid flash ~2s
     Outro:  Black slam → site reveal ~1s
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

    /* ── PHASE 1: Logo + Fast Counter ── */
    showPhase(phase1);

    var count = 0;
    var counterDuration = 1600; // faster sprint
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
          // Flash white on completion
          if (phase1) {
            phase1.style.background = '#fff';
            phase1.style.transition = 'background 0.05s';
            setTimeout(function () {
              phase1.style.background = '';
              phase1.style.transition = '';
              hidePhase(phase1);
              setTimeout(startPhase2, 300);
            }, 80);
          } else {
            setTimeout(startPhase2, 400);
          }
        }
      }, counterStep);
    }, 400);

    /* ── PHASE 2: Tagline wipe + chars slam ── */
    function startPhase2() {
      showPhase(phase2);
      // Chars slam in with stagger
      chars.forEach(function (ch, i) {
        setTimeout(function () {
          ch.style.opacity = '1';
          ch.style.transform = 'translateY(0) scale(1)';
          ch.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        }, 800 + i * 160);
      });
      var phase2Duration = 800 + chars.length * 160 + 700;
      setTimeout(function () {
        // Slam out
        chars.forEach(function (ch) {
          ch.style.transition = 'opacity 0.2s ease, transform 0.3s ease';
          ch.style.opacity = '0';
          ch.style.transform = 'translateY(-20px) scale(1.1)';
        });
        setTimeout(function () {
          hidePhase(phase2);
          setTimeout(startPhase3, 200);
        }, 300);
      }, phase2Duration);
    }

    /* ── PHASE 3: Rapid fullscreen photo flash ── */
    function startPhase3() {
      showPhase(phase3);

      // Add photo counter element
      var photoNumEl = document.createElement('div');
      photoNumEl.className = 'intro-photo-num';
      var photoContainer = document.getElementById('introPhotos');
      if (photoContainer) photoContainer.appendChild(photoNumEl);

      var flashInterval = 220; // fast flash per photo
      var idx = 0;

      function flashNext() {
        // Hide all
        photos.forEach(function (p) { p.classList.remove('visible'); });
        if (idx < photos.length) {
          photos[idx].classList.add('visible');
          if (photoNumEl) {
            photoNumEl.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(photos.length).padStart(2,'0');
          }
          idx++;
          setTimeout(flashNext, flashInterval);
        } else {
          // All shown — pause then outro
          setTimeout(startOutro, 400);
        }
      }

      setTimeout(flashNext, 100);
    }

    /* ── OUTRO: Black slam + site reveal ── */
    function startOutro() {
      if (outro) {
        outro.style.pointerEvents = 'all';
        outro.style.transition = 'opacity 0.3s ease';
        outro.classList.add('fade-in');
        setTimeout(function () {
          introLoader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 350);
      } else {
        introLoader.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  }

  /* ── Navbar scroll effect ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Mobile nav toggle ── */
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

  /* ── Active nav link on scroll ── */
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
