/* 汐奎攝影 XIKUI PHOTOGRAPHY — Main JS */

document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     INTRO LOADER — Multi-Phase Animation
     Total ~10s:
     Phase1: Logo + counter (0→100) ~4s
     Phase2: Tagline scroll + chars pop ~3s
     Phase3: Photo flash ~2s
     Outro:  Fade black → reveal site ~1s
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

    /* ── PHASE 1: Logo + Counter ── */
    showPhase(phase1);

    var count = 0;
    var counterDuration = 3000;
    var counterStep = counterDuration / 100;

    // Start counter after logo appears
    setTimeout(function () {
      if (fill) {
        fill.style.transition = 'width ' + counterDuration + 'ms linear';
        fill.style.width = '100%';
      }
      var timer = setInterval(function () {
        count++;
        if (numEl) numEl.textContent = count;
        if (count >= 100) {
          clearInterval(timer);
          setTimeout(function () {
            hidePhase(phase1);
            setTimeout(startPhase2, 500);
          }, 600);
        }
      }, counterStep);
    }, 700);

    /* ── PHASE 2: Tagline + Brand Chars ── */
    function startPhase2() {
      showPhase(phase2);
      // Stagger each character pop
      chars.forEach(function (ch, i) {
        setTimeout(function () {
          ch.style.opacity = '1';
          ch.style.transform = 'translateY(0) scale(1)';
          ch.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        }, 900 + i * 220);
      });
      // After all chars visible, go to phase 3
      var phase2Duration = 900 + chars.length * 220 + 1000;
      setTimeout(function () {
        hidePhase(phase2);
        setTimeout(startPhase3, 400);
      }, phase2Duration);
    }

    /* ── PHASE 3: Photo Flashes ── */
    function startPhase3() {
      showPhase(phase3);
      photos.forEach(function (photo, i) {
        setTimeout(function () {
          photo.classList.add('visible');
        }, i * 400);
      });
      // After all photos shown, fade to outro
      var phase3Duration = photos.length * 400 + 700;
      setTimeout(function () {
        hidePhase(phase3);
        startOutro();
      }, phase3Duration);
    }

    /* ── OUTRO: Fade black then reveal site ── */
    function startOutro() {
      if (outro) {
        outro.style.pointerEvents = 'all';
        outro.classList.add('fade-in');
        setTimeout(function () {
          introLoader.classList.add('hidden');
          document.body.style.overflow = '';
          // slight delay then fade out outro overlay revealing page
          outro.classList.remove('fade-in');
          outro.classList.add('fade-out');
        }, 900);
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
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
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
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ── Contact form submit ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('訊息已送出，我們將盡快回覆您。');
      form.reset();
    });
  }

  /* ── Toast helper ── */
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
