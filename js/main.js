/* 汐奎攝影 XIKUI PHOTOGRAPHY — Main JS */

/* ── Lenis Smooth Scroll ── */
var lenis = null;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.0,
    easing: function (t) { return 1 - Math.pow(1 - t, 4); },
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  function rafLoop(time) {
    lenis.raf(time);
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  /* Forward Lenis scroll events to native listeners */
  lenis.on('scroll', function (e) {
    window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
  });
}

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

    var skipBtn = document.getElementById('introSkip');
    var skipped = false;

    function showPhase(el) { if (el) el.classList.add('active'); }
    function hidePhase(el) { if (el) el.classList.remove('active'); }

    // Skip button click — jump straight to outro
    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        if (skipped) return;
        skipped = true;
        skipBtn.classList.remove('visible');
        // Hide all phases immediately
        [phase1, phase2, phase3].forEach(function (p) {
          if (p) { p.style.transition = 'opacity 0.2s ease'; p.style.opacity = '0'; }
        });
        setTimeout(startOutro, 220);
      });
    }

    // Ken Burns classes for each photo
    var kbClasses = ['kb-in','kb-right','kb-left','kb-up','kb-out','kb-in','kb-right','kb-left','kb-up','kb-in','kb-out','kb-right'];

    // Per-photo timing: hold duration (ms) + whether to fire shutter flash before showing
    var photoTimings = [
      { hold: 340, flash: true  },
      { hold: 270, flash: true  },
      { hold: 310, flash: true  },
      { hold: 240, flash: true  },
      { hold: 270, flash: true  },
      { hold: 360, flash: true  },
      { hold: 250, flash: true  },
      { hold: 290, flash: true  },
      { hold: 330, flash: true  },
      { hold: 260, flash: true  },
      { hold: 400, flash: true  },
      { hold: 480, flash: false },
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
        if (numEl) numEl.textContent = String(count).padStart(3, '0');
        if (count >= 100) {
          clearInterval(timer);
          // Show skip button after phase 1 completes
          if (skipBtn) skipBtn.classList.add('visible');
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

    /* ── PHASE 2: Cinematic Title Card ── */
    function startPhase2() {
      showPhase(phase2);

      var accentLine = document.getElementById('p2AccentLine');
      var sinceEl    = document.getElementById('p2Since');
      var enSub      = document.getElementById('p2EnSub');

      // 1. Tagline reveals via clip-path (CSS handles on .active)

      // 2. Accent line draws out
      setTimeout(function () {
        if (accentLine) accentLine.classList.add('expanded');
      }, 750);

      // 3. Characters drift in slowly — elegant, not slamming
      chars.forEach(function (ch, i) {
        setTimeout(function () {
          ch.style.transition = 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)';
          ch.style.opacity    = '1';
          ch.style.transform  = 'translateY(0)';
        }, 950 + i * 160);
      });

      // 4. SINCE 2018 + English subtitle drift in after all chars
      var subDelay = 950 + chars.length * 160 + 80;
      setTimeout(function () {
        if (sinceEl) sinceEl.classList.add('visible');
        setTimeout(function () {
          if (enSub) enSub.classList.add('visible');
        }, 200);
      }, subDelay);

      // 5. Hold then elegant whole-phase fade out
      var exitDelay = subDelay + 1200;
      setTimeout(function () {
        phase2.style.transition = 'opacity 0.8s ease';
        phase2.style.opacity    = '0';
        setTimeout(function () {
          hidePhase(phase2);
          // Reset for potential re-use
          phase2.style.opacity    = '';
          phase2.style.transition = '';
          chars.forEach(function (ch) {
            ch.style.opacity    = '0';
            ch.style.transform  = 'translateY(22px)';
            ch.style.transition = '';
          });
          if (accentLine) accentLine.classList.remove('expanded');
          if (sinceEl) sinceEl.classList.remove('visible');
          if (enSub) enSub.classList.remove('visible');
          setTimeout(startPhase3, 60);
        }, 820);
      }, exitDelay);
    }

    /* ── PHASE 3: Cinematic crossfade dissolve + Ken Burns + Text ── */
    function startPhase3() {
      showPhase(phase3);

      var progressEl = document.getElementById('photoProgress');
      var numEl3     = document.getElementById('photoNum');
      var line1El    = document.getElementById('p3Line1');
      var line2El    = document.getElementById('p3Line2');
      var total      = photos.length;
      var idx        = 0;
      var crossfade  = 500;
      var hold       = 600;

      // Text groups: 4 groups × 3 photos = 12
      var textGroups = [
        ['廢墟不是可怕的地方', '而是人們遺忘的地方'],
        ['廢墟曾經的輝煌故事', '現在只能用鏡頭記錄'],
        ['再也無人光顧的景點', '沒有歡笑聲的樂園'],
        ['人去樓空的餐廳', '灰塵沉積的走廊'],
      ];

      var currentGroup = -1;

      function updateTextGroup(photoIdx) {
        var groupIdx = Math.floor(photoIdx / 3);
        if (groupIdx === currentGroup || groupIdx >= textGroups.length) return;
        currentGroup = groupIdx;
        var group = textGroups[groupIdx];

        // Fade out previous lines
        if (line1El) line1El.classList.remove('visible');
        if (line2El) line2El.classList.remove('visible');

        // Set new content and fade in with stagger
        setTimeout(function () {
          if (line1El) { line1El.textContent = group[0]; line1El.classList.add('visible'); }
          setTimeout(function () {
            if (line2El) { line2El.textContent = group[1]; line2El.classList.add('visible'); }
          }, 220);
        }, groupIdx === 0 ? 300 : 150);
      }

      // Assign z-index so later photos sit on top during crossfade
      photos.forEach(function (p, i) { p.style.zIndex = i + 1; });

      function showNext() {
        if (idx >= total) {
          // Fade out text and last photo, then outro
          if (line1El) line1El.classList.remove('visible');
          if (line2El) line2El.classList.remove('visible');
          var last = photos[total - 1];
          if (last) {
            last.style.transition = 'opacity 0.7s ease';
            last.style.opacity    = '0';
          }
          setTimeout(startOutro, 720);
          return;
        }

        var photo = photos[idx];
        var kb    = kbClasses[idx % kbClasses.length];

        // Counter & progress
        if (numEl3) {
          numEl3.textContent =
            String(idx + 1).padStart(2, '0') + '  /  ' + String(total).padStart(2, '0');
        }
        if (progressEl) {
          progressEl.style.transition = 'width ' + ((crossfade + hold) / 1000) + 's linear';
          progressEl.style.width      = ((idx + 1) / total * 100) + '%';
        }

        // Update text group at start of each new group
        updateTextGroup(idx);

        // Reset & crossfade in
        photo.style.transition = 'none';
        photo.style.opacity    = '0';
        photo.style.transform  = '';
        photo.className        = 'intro-photo';
        photo.classList.add('visible');
        photo.classList.add(kb);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            photo.style.transition = 'opacity ' + (crossfade / 1000) + 's ease';
            photo.style.opacity    = '1';

            setTimeout(function () {
              idx++;
              showNext();
            }, crossfade + hold);
          });
        });
      }

      setTimeout(showNext, 120);
    }

    /* ── OUTRO: Fade black → reveal site with entrance animation ── */
    function startOutro() {
      if (skipBtn) { skipBtn.classList.remove('visible'); skipBtn.style.display = 'none'; }
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
    var onScroll = function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('lenis-scroll', onScroll);
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
  var onScrollActive = function () {
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScrollActive);
  window.addEventListener('lenis-scroll', onScrollActive);

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

  /* ── Smooth scroll (via Lenis or native) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* Start Lenis after DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenis);
} else {
  initLenis();
}

/* ── Portfolio Hover Slideshow ── */
(function () {
  document.querySelectorAll('.portfolio-item[data-slides]').forEach(function (item) {
    var slides = item.getAttribute('data-slides').split(',');
    if (slides.length < 2) return;

    var imgDiv  = item.querySelector('.portfolio-img');
    var nextDiv = item.querySelector('.portfolio-img-next');
    if (!imgDiv || !nextDiv) return;

    var timer      = null;
    var currentIdx = 0;

    item.addEventListener('mouseenter', function () {
      if (timer) return;
      timer = setInterval(function () {
        currentIdx = (currentIdx + 1) % slides.length;
        var src = slides[currentIdx].trim();

        /* Pre-load */
        var img = new Image();
        img.onload = function () {
          nextDiv.style.backgroundImage = "url('" + src + "')";
          nextDiv.classList.add('visible');

          /* After crossfade completes, swap base and reset overlay */
          setTimeout(function () {
            imgDiv.style.backgroundImage = "url('" + src + "')";
            nextDiv.classList.remove('visible');
          }, 950);
        };
        img.src = src;
      }, 3000);
    });

    item.addEventListener('mouseleave', function () {
      clearInterval(timer);
      timer = null;
      nextDiv.classList.remove('visible');
      /* Reset to first image after overlay fades out */
      setTimeout(function () {
        currentIdx = 0;
        imgDiv.style.backgroundImage = "url('" + slides[0].trim() + "')";
      }, 950);
    });
  });
})();

/* ── Custom Cursor ── */
(function () {
  var ring = document.getElementById('cursorRing');
  var dot  = document.getElementById('cursorDot');
  if (!ring || !dot) return;

  var mouseX = -100, mouseY = -100;
  var ringX  = -100, ringY  = -100;
  var isTouch = false;

  /* Detect touch to hide cursor */
  window.addEventListener('touchstart', function () {
    isTouch = true;
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  }, { once: true });

  /* Track mouse position */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    /* Dot snaps to mouse immediately */
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  /* Ring follows with smooth lag */
  function rafCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(rafCursor);
  }
  rafCursor();

  /* Hover state on interactive elements */
  var hoverEls = document.querySelectorAll(
    'a, button, .portfolio-item, .filter-btn, .social-btn, .nav-toggle, .intro-skip'
  );
  hoverEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', function () {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    });
  });

  /* Click state */
  document.addEventListener('mousedown', function () { ring.classList.add('cursor-click'); });
  document.addEventListener('mouseup',   function () { ring.classList.remove('cursor-click'); });

  /* Fade out when mouse leaves window */
  document.addEventListener('mouseleave', function () {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', function () {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });
})();
