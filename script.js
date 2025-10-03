/* scripts.js
  Hero crossfade slideshow (opacity transition), pause-on-hover, keyboard, swipe.
  Works grid filter + lightbox.
  Comments show where to replace assets or hooks for CMS loading.
*/

document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- HERO SLIDESHOW ---------- */
  const slidesWrap = document.getElementById('hero-slides');
  const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.hero-control.prev');
  const nextBtn = document.querySelector('.hero-control.next');
  const indicators = document.getElementById('hero-indicators');

  // config: fade (ms) and slide duration (ms)
  const FADE_MS = 1800;     // ~1.8s (matches CSS)
  const SLIDE_DURATION = 7000; // 7s per slide

  let current = 0;
  let timer = null;
  let paused = false;

  // build indicators
  slides.forEach((s, i) => {
    const li = document.createElement('li');
    li.dataset.index = i;
    if (i === 0) li.classList.add('active');
    li.addEventListener('click', () => goTo(i));
    indicators.appendChild(li);
  });

  function show(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
      const vid = s.querySelector('video');
      if (vid) {
        if (idx === i) {
          vid.currentTime = 0;
          vid.play().catch(()=>{/* autoplay muted policy: ensure muted */});
        } else {
          vid.pause();
        }
      }
    });
    Array.from(indicators.children).forEach((n, idx) => n.classList.toggle('active', idx === i));
    current = i;
  }

  function goTo(i) {
    show(i);
    resetTimer();
  }

  function next() { goTo((current+1) % slides.length); }
  function prev() { goTo((current-1 + slides.length) % slides.length); }

  function resetTimer() {
    clearTimeout(timer);
    if (!paused) timer = setTimeout(next, SLIDE_DURATION);
  }

  // pause on hover
  slidesWrap.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
  slidesWrap.addEventListener('mouseleave', () => { paused = false; resetTimer(); });

  // controls
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') closeLightbox();
  });

  // touch swipe
  let startX = null;
  slidesWrap.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX);
  slidesWrap.addEventListener('touchend', (e)=> {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
    startX = null;
  });

  // init
  show(0);
  resetTimer();


  /* ---------- WORKS FILTERS + LIGHTBOX ---------- */
  const filterButtons = document.querySelectorAll('.filters button');
  const tilesWrap = document.getElementById('works-tiles');

  // basic filter handling
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      applyFilter(cat);
    });
  });

  function applyFilter(cat) {
    Array.from(tilesWrap.querySelectorAll('.tile')).forEach(t => {
      const cats = (t.dataset.cats || '').split(',').map(c=>c.trim());
      if (cat === 'all' || cats.includes(cat)) t.style.display = '';
      else t.style.display = 'none';
    });
  }

  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lbMedia = document.getElementById('lb-media');
  const lbTitle = document.getElementById('lb-title');
  const lbCredits = document.getElementById('lb-credits');
  const lbText = document.getElementById('lb-text');
  const lbDownload = document.getElementById('lb-download');

  // open lightbox from static tiles (and from JSON-populated tiles below)
  function openLightboxFromTile(tile) {
    const img = tile.querySelector('img');
    const title = tile.querySelector('h3')?.textContent || '';
    const sub = tile.querySelector('.sub')?.textContent || '';
    lbMedia.innerHTML = '';
    if (img) {
      const large = document.createElement('img');
      large.src = img.src.replace('thumb','hero') || img.src;
      large.alt = img.alt || title;
      lbMedia.appendChild(large);
    }
    lbTitle.textContent = title;
    lbCredits.textContent = sub;
    lbText.textContent = 'Short project text — replace via example-content.json or CMS.';
    lbDownload.href = '/assets/example-presskit.pdf';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  Array.from(tilesWrap.querySelectorAll('.tile')).forEach(t => t.addEventListener('click', ()=>openLightboxFromTile(t)));

  // close logic
  document.querySelectorAll('.lb-close').forEach(btn => btn.addEventListener('click', closeLightbox));
  lightbox.addEventListener('click', (e)=> { if (e.target === lightbox) closeLightbox(); });
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lbMedia.innerHTML = '';
  }

  /* ---------- LANGUAGE TOGGLE ---------- */
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const pressed = langToggle.getAttribute('aria-pressed') === 'true';
      langToggle.setAttribute('aria-pressed', String(!pressed));
      document.querySelectorAll('.fa, .fa *').forEach(n => n.hidden = pressed);
      document.querySelectorAll('.en, .en *').forEach(n => n.hidden = !pressed);
    });
  }

  /* ---------- LAZY images default ---------- */
  document.querySelectorAll('img').forEach(img => { if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy'); });

  /* ---------- OPTIONAL: load content from example-content.json (flat-file CMS) ---------- */
  fetch('/example-content.json').then(r=>r.json()).then(data=>{
    if (!data.works) return;
    tilesWrap.innerHTML = '';
    data.works.forEach(item => {
      const art = document.createElement('article');
      art.className = 'tile';
      if (item.collection) art.classList.add('collection');
      art.dataset.cats = item.categories.join(',');
      art.tabIndex = 0;
      art.innerHTML = `
        <img src="${item.thumb}" alt="${item.alt || item.title}" loading="lazy">
        <div class="tile-meta">
          <h3>${item.title}</h3>
          <p class="sub">${item.year} — ${item.medium}</p>
        </div>
      `;
      art.addEventListener('click', () => {
        lbMedia.innerHTML = '';
        if (item.type === 'video') {
          const iframe = document.createElement('iframe');
          iframe.src = item.embed || item.video || '';
          iframe.width = "100%";
          iframe.height = "480";
          iframe.allow = "autoplay; fullscreen";
          iframe.setAttribute('frameborder','0');
          lbMedia.appendChild(iframe);
        } else {
          const img = document.createElement('img');
          img.src = item.large || item.thumb;
          img.alt = item.alt || item.title;
          lbMedia.appendChild(img);
        }
        lbTitle.textContent = item.title;
        lbCredits.textContent = item.credits || '';
        lbText.textContent = item.text || '';
        lbDownload.href = item.presskit || '#';
        lightbox.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
      });
      tilesWrap.appendChild(art);
    });
  }).catch(()=>{/* no JSON — ignore */});

});
