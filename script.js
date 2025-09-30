/* scripts.js - hero crossfade, filters, modal, statement expand, swipe support */
document.addEventListener('DOMContentLoaded', function () {
  /* ========== Hero slideshow ========== */
  const slideshow = document.getElementById('slideshow');
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const prevBtn = slideshow.querySelector('.prev');
  const nextBtn = slideshow.querySelector('.next');
  const dotsWrap = document.getElementById('dots');

  let current = 0;
  const fadeDuration = 1800; // ms (matches CSS)
  const slideDuration = 7000; // ms per slide
  let timer = null;
  let paused = false;

  function createDots() {
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = i === 0 ? 'active' : '';
      btn.setAttribute('aria-label', `Go to slide ${i+1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    });
  }

  function show(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }

  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  function goTo(i) {
    show(i);
    resetTimer();
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => { if (!paused) next(); }, slideDuration);
  }

  // Pause on hover
  slideshow.addEventListener('mouseenter', () => { paused = true; });
  slideshow.addEventListener('mouseleave', () => { paused = false; });

  // Controls
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeModal();
  });

  // Build dots and start
  createDots();
  show(0);
  resetTimer();

  /* ========== Swipe support for mobile ========== */
  let touchStartX = 0;
  slideshow.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, {passive:true});
  slideshow.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) prev();
    else if (dx < -50) next();
  });

  /* ========== Works grid (load from example-content.json) ========== */
  const grid = document.getElementById('works-grid');
  const filters = Array.from(document.querySelectorAll('.filters button'));

  // Load content JSON (local)
  fetch('example-content.json').then(r => r.json()).then(data => {
    window.WORKS = data.works || [];
    renderWorks(window.WORKS);
  }).catch(err => {
    // fallback demo items if json missing
    console.warn('example-content.json not found; using placeholder items.', err);
    const fallback = [
      {id:'demo1',title:'Almost Blue',year:'2024',category:'clothing',thumb:'assets/thumb1.jpg',type:'image',desc:'Cyanotype tank top'},
      {id:'demo2',title:'Paper Dress',year:'2023',category:'stopmotion',thumb:'assets/thumb2.jpg',type:'video',video:'assets/demo-video.mp4',desc:'Stop motion short'}
    ];
    window.WORKS = fallback;
    renderWorks(window.WORKS);
  });

  function renderWorks(items){
    grid.innerHTML = '';
    items.forEach(item => {
      const t = document.createElement('article');
      t.className = 'tile';
      t.tabIndex = 0;
      t.dataset.category = item.category || 'other';
      t.innerHTML = `
        <img src="${item.thumb}" alt="${item.title} — ${item.year}">
        <div class="meta"><strong>${item.title}</strong><div>${item.year} — ${item.medium || ''}</div></div>
      `;
      t.addEventListener('click', () => openModal(item));
      grid.appendChild(t);
    });
  }

  // Filter buttons
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      filterGrid(f);
    });
  });

  function filterGrid(filter){
    const tiles = Array.from(grid.children);
    tiles.forEach(t => {
      if (filter === 'all' || t.dataset.category === filter) t.style.display = '';
      else t.style.display = 'none';
    });
  }

  /* ========== Modal lightbox ========== */
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.querySelector('.modal-close');

  function openModal(item){
    modalContent.innerHTML = '';
    modal.setAttribute('aria-hidden', 'false');
    // Render content
    if (item.type === 'video' && (item.video || item.embed)){
      if (item.embed){
        modalContent.innerHTML = `<h3 id="modal-title">${item.title} — ${item.year}</h3><div>${item.embed}</div><p>${item.desc || ''}</p>`;
      } else {
        modalContent.innerHTML = `<h3 id="modal-title">${item.title} — ${item.year}</h3><video controls src="${item.video}" style="max-width:100%"></video><p>${item.desc || ''}</p>`;
      }
    } else {
      modalContent.innerHTML = `<h3 id="modal-title">${item.title} — ${item.year}</h3><img src="${item.full || item.thumb}" alt="${item.title}" style="max-width:100%"><p>${item.desc||''}</p>`;
    }

    // optional PDF
    if (item.pdf) {
      const a = document.createElement('a');
      a.href = item.pdf; a.textContent = 'Download press kit (PDF)'; a.className='btn';
      modalContent.appendChild(a);
    }

    document.body.style.overflow = 'hidden';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if (e.target === modal) closeModal(); });

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  /* ========== Statement expand ========== */
  const expandBtn = document.getElementById('expand-statement');
  if (expandBtn){
    expandBtn.addEventListener('click', () => {
      const long = document.querySelector('.statement-long');
      const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
      expandBtn.setAttribute('aria-expanded', String(!expanded));
      long.hidden = expanded;
      expandBtn.textContent = expanded ? 'Read more' : 'Show less';
    });
  }
});
