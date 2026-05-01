// ===== PARTICLES CANVAS =====
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
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 90, 31, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 90, 31, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// =====================================================
const cursor = document.getElementById('custom-cursor');

// Mouse position tracking
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// LERP speed — fast for a pointer
const SPEED = 0.25; 


// Track mouse position
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// LERP function
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Main animation loop — requestAnimationFrame for 60fps smooth
function animateCursor() {
  // Smooth LERP movement
  pos.x = lerp(pos.x, mouse.x, SPEED);
  pos.y = lerp(pos.y, mouse.y, SPEED);

  // Apply transform
  cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Interactive element hover detection + magnetic pull
const interactiveSelectors = 'a, button, input, textarea, .process-card, .why-card, .founder-card, .social-icon, .nav-cta, .btn-primary, .btn-secondary, .submit-btn';

document.querySelectorAll(interactiveSelectors).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

// Click feedback
document.addEventListener('mousedown', () => {
  cursor.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicking');
});

// ===== PARALLAX ON HERO IMAGE & GLOW & ORBIT =====
document.addEventListener('mousemove', (e) => {
  const heroImg = document.querySelector('.hero-illustration');
  const glowBlobs = document.querySelector('.hero-glow-blobs');
  const heroOrbit = document.querySelector('.hero-orbit');
  
  if (heroImg && glowBlobs && heroOrbit) {
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    
    heroImg.style.transform = `translate(${x}px, ${y}px)`;
    glowBlobs.style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
    heroOrbit.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  }
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// ===== SMOOTH SCROLL =====
function smoothScroll(target) {
  const el = document.querySelector(target);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.highlight').forEach(h => h.classList.add('animate'));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Staggered card reveals
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.process-card, .why-card, .founder-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = `opacity 0.6s cubic-bezier(.4,0,.2,1) ${i * 0.08}s, transform 0.6s cubic-bezier(.4,0,.2,1) ${i * 0.08}s`;
        }, i * 80);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.process-grid, .why-grid, .founders-grid').forEach(el => {
  cardObserver.observe(el);
  el.querySelectorAll('.process-card, .why-card, .founder-card').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(40px)';
  });
});

// ===== FEEDBACK FORM =====
function handleFeedbackSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const submitBtn = form.querySelector('.submit-btn');
  
  submitBtn.disabled = true;
  submitBtn.innerText = 'Sending...';

  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      document.getElementById('successMsg').classList.add('show');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit Feedback';
      setTimeout(() => {
        document.getElementById('successMsg').classList.remove('show');
      }, 4000);
    } else {
      alert("Oops! There was a problem submitting your form");
    }
  }).catch(error => {
    alert("Oops! There was a problem submitting your form");
  });
}

// ===== PARALLAX ON HERO IMAGE =====
const heroImg = document.querySelector('.hero-illustration');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });
}

console.log('Dudu IVHub — Loaded Successfully');
