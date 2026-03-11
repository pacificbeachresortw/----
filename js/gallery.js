/* 汐奎攝影 XIKUI PHOTOGRAPHY — Gallery Filter JS */

document.addEventListener('DOMContentLoaded', function () {

  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {

      /* Update active button */
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(function (item) {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          /* Re-trigger entrance animation */
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
          setTimeout(function () {
            item.classList.add('hidden');
          }, 300);
        }
      });

      /* Fix grid layout for large items after filter */
      setTimeout(fixGridLayout, 350);
    });
  });

  /* Ensure large class is handled properly after filtering */
  function fixGridLayout() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    const visibleItems = Array.from(portfolioItems).filter(function (item) {
      return !item.classList.contains('hidden');
    });

    /* If only one visible item remains, remove large class temporarily */
    visibleItems.forEach(function (item, idx) {
      if (visibleItems.length === 1) {
        item.style.gridColumn = 'span 3';
      } else {
        item.style.gridColumn = '';
      }
    });
  }

  /* Portfolio item click — open lightbox stub */
  portfolioItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const name = item.querySelector('.portfolio-name');
      const cat  = item.querySelector('.portfolio-cat');
      if (name && cat) {
        openLightbox(cat.textContent, name.textContent);
      }
    });
  });

  /* Simple lightbox */
  function openLightbox(category, title) {
    const existing = document.getElementById('lightbox');
    if (existing) existing.remove();

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,.95)',
      'z-index:9998', 'display:flex', 'align-items:center',
      'justify-content:center', 'flex-direction:column',
      'gap:20px', 'cursor:pointer',
      'animation:fadeInUp 0.4s ease forwards'
    ].join(';');

    lb.innerHTML = [
      '<div style="text-align:center;padding:40px">',
        '<p style="font-family:Montserrat,sans-serif;font-size:.6rem;letter-spacing:.4em;color:#888;text-transform:uppercase;margin-bottom:16px">' + category + '</p>',
        '<h2 style="font-family:Playfair Display,Georgia,serif;font-size:2.5rem;font-weight:400;color:#fff;margin-bottom:24px">' + title + '</h2>',
        '<div style="width:40px;height:1px;background:#555;margin:0 auto 24px"></div>',
        '<p style="font-family:Cormorant Garamond,Georgia,serif;font-size:1rem;color:#888;letter-spacing:.1em">點擊任意處關閉</p>',
        '<div style="margin-top:32px;width:80px;height:80px;border:1px solid #333;display:flex;align-items:center;justify-content:center;margin:32px auto 0">',
          '<i class="fa-solid fa-camera" style="font-size:1.5rem;color:#555"></i>',
        '</div>',
      '</div>'
    ].join('');

    lb.addEventListener('click', function () {
      lb.style.opacity = '0';
      lb.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { lb.remove(); }, 300);
    });

    document.body.appendChild(lb);
  }

});
