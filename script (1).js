// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40 ? 'rgba(5,5,5,0.99)' : 'rgba(10,10,10,0.96)';
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
      link.style.color = '#C8102E';
    } else {
      link.style.color = '';
    }
  });
});

// Scroll-in animation
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOpts);

document.querySelectorAll('.card, .sol-card, .del-item, .step, .obj-item, .stat, .form-wrapper').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Counter animation
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      if (!isNaN(target)) animateCounter(el, target);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => statsObserver.observe(el));

// Form → WhatsApp
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const email = document.getElementById('email').value.trim();
  const cnpj = document.getElementById('cnpj').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !whatsapp || !mensagem) {
    alert('Por favor, preencha os campos obrigatórios.');
    return;
  }

  let msg = `*Diagnóstico Executivo — Na Tela Imports*%0A%0A`;
  msg += `*Nome:* ${nome}%0A`;
  msg += `*WhatsApp:* ${whatsapp}%0A`;
  if (email) msg += `*E-mail:* ${email}%0A`;
  if (cnpj) msg += `*CNPJ:* ${cnpj}%0A`;
  msg += `%0A*Mensagem:*%0A${mensagem.replace(/\n/g, '%0A')}`;

  window.open(`https://wa.me/5511956655623?text=${msg}`, '_blank');
});

// CNPJ mask
document.getElementById('cnpj').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').substring(0,14);
  v = v.replace(/(\d{2})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d)/,'$1/$2');
  v = v.replace(/(\d{4})(\d)/,'$1-$2');
  this.value = v;
});

// WhatsApp mask
document.getElementById('whatsapp').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').substring(0,11);
  v = v.replace(/(\d{2})(\d)/,'($1) $2');
  v = v.replace(/(\d{5})(\d)/,'$1-$2');
  this.value = v;
});
