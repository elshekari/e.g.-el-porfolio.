const slides = document.querySelectorAll('.slide');
let current = 0;
let interval = setInterval(nextSlide,7000);

function showSlide(index){
  slides.forEach((s,i)=>s.classList.toggle('active',i===index));
}

function nextSlide(){ current=(current+1)%slides.length; showSlide(current);}
function prevSlide(){ current=(current-1+slides.length-1)%slides.length; showSlide(current);}

document.querySelector('.hero-control.next').addEventListener('click',()=>{nextSlide(); resetInterval();});
document.querySelector('.hero-control.prev').addEventListener('click',()=>{prevSlide(); resetInterval();});
document.getElementById('hero-slides').addEventListener('mouseenter',()=>clearInterval(interval));
document.getElementById('hero-slides').addEventListener('mouseleave',()=>interval=setInterval(nextSlide,7000));
function resetInterval(){clearInterval(interval); interval=setInterval(nextSlide,7000);}
