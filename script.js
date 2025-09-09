// el — portfolio interactions

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Set your social links once here
const LINKS = {
  venmo: 'https://venmo.com/YOURLINK',           // <-- replace
  youtube: 'https://youtube.com/@elelsh',        // <-- replace (optional: your channel)
  linkedin: 'https://www.linkedin.com/in/YOURID',// <-- replace
  instagram: 'https://instagram.com/elshekaari'  // <-- replace
};

document.getElementById('link-venmo').href = LINKS.venmo;
document.getElementById('link-youtube').href = LINKS.youtube;
document.getElementById('link-linkedin').href = LINKS.linkedin;
document.getElementById('link-instagram').href = LINKS.instagram;
document.getElementById('venmo-button').href = LINKS.venmo;

document.getElementById('foot-venmo').href = LINKS.venmo;
document.getElementById('foot-youtube').href = LINKS.youtube;
document.getElementById('foot-linkedin').href = LINKS.linkedin;
document.getElementById('foot-instagram').href = LINKS.instagram;

// Filters
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.style.display = show ? '' : 'none';
      if(show) c.classList.add('reveal');
    });
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, {threshold: 0.12});

document.querySelectorAll('.card, .about, .contact').forEach(el => {
  el.classList.add('reveal'); io.observe(el);
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbContent = lightbox.querySelector('.lb-content');
const lbClose = lightbox.querySelector('.lb-close');

function openLB(node){
  lbContent.innerHTML = '';
  const clone = node.cloneNode(true);
  if(clone.tagName === 'IMG' || clone.tagName === 'VIDEO'){
    clone.controls = true;
    clone.autoplay = true;
    clone.muted = false;
  }
  lbContent.appendChild(clone);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden','false');
}
function closeLB(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden','true');
  lbContent.innerHTML = '';
}
lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLB(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLB(); });

document.querySelectorAll('.card img, .card video').forEach(media => {
  media.addEventListener('click', ()=> openLB(media));
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
