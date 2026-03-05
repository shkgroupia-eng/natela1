
// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

// ===== CUSTOM CURSOR (apenas pointer:fine / mouse real) =====
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;
  let tx = -100, ty = -100, cx = -100, cy = -100;
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top = ty + 'px';
  });
  function animateTrail() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    trail.style.left = cx + 'px';
    trail.style.top = cy + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '18px'; cursor.style.height = '18px';
      cursor.style.background = 'transparent';
      cursor.style.border = '2px solid var(--red)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px'; cursor.style.height = '10px';
      cursor.style.background = 'var(--red)';
      cursor.style.border = 'none';
    });
  });
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    s1.style.transform = 'rotate(45deg) translate(5px,5px)';
    s2.style.opacity = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    [s1,s2,s3].forEach(s => { s.style.transform=''; s.style.opacity=''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,16,46,${this.opacity})`;
    ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== AOS =====
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-aos-delay') || 0;
      setTimeout(() => entry.target.classList.add('aos-visible'), parseInt(delay));
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ===== COUNTER =====
function countUp(el, target) {
  let start = 0, duration = 2000, startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      if (!isNaN(target)) countUp(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

// ===== BAR FILLS =====
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-width]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.getAttribute('data-width'); }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.hero-dashboard, #resultados').forEach(el => barObserver.observe(el));

// ===== FORM =====
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const wa = document.getElementById('whatsapp').value.trim();
  const email = document.getElementById('email').value.trim();
  const cnpj = document.getElementById('cnpj').value.trim();
  const msg = document.getElementById('mensagem').value.trim();
  if (!nome || !wa || !msg) { alert('Preencha os campos obrigatórios.'); return; }
  let text = `*Diagnóstico Executivo — Na Tela Imports*%0A%0A*Nome:* ${encodeURIComponent(nome)}%0A*WhatsApp:* ${encodeURIComponent(wa)}`;
  if (email) text += `%0A*E-mail:* ${encodeURIComponent(email)}`;
  if (cnpj) text += `%0A*CNPJ:* ${encodeURIComponent(cnpj)}`;
  text += `%0A%0A*Operação:*%0A${encodeURIComponent(msg)}`;
  window.open(`https://wa.me/5511956655623?text=${text}`, '_blank');
});

// ===== MASKS =====
document.getElementById('cnpj').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').substring(0,14);
  v = v.replace(/(\d{2})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  this.value = v;
});
document.getElementById('whatsapp').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').substring(0,11);
  v = v.replace(/(\d{2})(\d)/, '($1) $2');
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  this.value = v;
});

// ===== ACTIVE NAV =====
const navSections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  navSections.forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;
    const inView = sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY;
    link.style.color = inView ? '#C8102E' : '';
  });
});
