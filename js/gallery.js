/* 汐奎攝影 XIKUI PHOTOGRAPHY — Gallery Filter + Page Transition JS */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Portfolio filter ── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              });
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(function () { item.classList.add('hidden'); }, 300);
          }
        });
      });
    });
  }

  /* ── Page transition overlay ── */
  // Create overlay element
  var overlay = document.createElement('div');
  overlay.id = 'pageTransitionOverlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:#000',
    'z-index:99999', 'pointer-events:none',
    'opacity:0', 'transition:opacity 0.5s cubic-bezier(0.76,0,0.24,1)'
  ].join(';');
  document.body.appendChild(overlay);

  // Intercept portfolio link clicks
  document.querySelectorAll('.portfolio-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();

      // Fade to black
      overlay.style.pointerEvents = 'all';
      overlay.style.opacity = '1';

      setTimeout(function () {
        window.location.href = href;
      }, 520);
    });
  });

  // On page load: fade in from black (for work detail pages coming back)
  overlay.style.opacity = '1';
  overlay.style.transition = 'none';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.transition = 'opacity 0.6s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.opacity = '0';
      setTimeout(function () {
        overlay.style.pointerEvents = 'none';
      }, 650);
    });
  });

});
