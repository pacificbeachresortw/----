/* 汐奎攝影 XIKUI PHOTOGRAPHY — Main JS */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Intro Loader ── */
  var introLoader  = document.getElementById('introLoader');
  var introCounter = document.getElementById('introCounter');

  if (introLoader) {
    document.body.style.overflow = 'hidden';

    // Step 1: show text with clip-path reveal
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        introLoader.classList.add('show-logo');
      });
    });

    // Step 2: animate counter 000 -> 100
    var count    = 0;
    var duration = 2000;
    var step     = duration / 100;
    var timer = setInterval(function () {
      count++;
      if (introCounter) {
        introCounter.textContent = String(count).padStart(3, '0');
      }
      if (count >= 100) {
        clearInterval(timer);
        // Step 3: open curtain panels
        setTimeout(function () {
          introLoader.classList.add('open');
          // Step 4: hide after panels exit
          setTimeout(function () {
            introLoader.classList.add('hidden');
            document.body.style.overflow = '';
          }, 950);
        }, 300);
      }
    }, step);
  }

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  /* Close mobile nav on link click */
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    let current = '';
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

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Contact form submit ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('訊息已送出，我們將盡快回覆您。');
      form.reset();
    });
  }

  /* ── Toast helper ── */
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3500);
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
