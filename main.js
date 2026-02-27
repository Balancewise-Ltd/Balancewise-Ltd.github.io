/**
 * Balancewise Technologies — Shared JS (all pages)
 */
'use strict';

// Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// Nav scroll
const nav = document.querySelector('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }));
}

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Scroll reveal
const revObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const d = parseFloat(entry.target.dataset.delay || 0) * 1000;
      setTimeout(() => entry.target.classList.add('in'), d);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rev, .rev-r').forEach(el => revObserver.observe(el));

// Toast
const toast = document.getElementById('toast');
function showToast(msg, err = false) {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = err ? '#dc2626' : '#0a1f5c';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// Form handler
function attachForm(id, submitId, apiPath) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById(submitId);
    btn.disabled = true; btn.textContent = 'Sending...';
    const data = {};
    new FormData(form).forEach((v, k) => data[k] = v);
    try {
      await fetch(apiPath, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } catch {}
    showToast(apiPath.includes('apply') ? 'Application received! We will be in touch shortly.' : 'Enquiry received! We will respond within 24 hours.');
    form.reset();
    btn.disabled = false; btn.textContent = btn.dataset.label || 'Submit';
  });
}

attachForm('contactForm', 'contactSubmit', '/api/contact');
attachForm('applyForm', 'applySubmit', '/api/apply');

// Form field validation colours
document.querySelectorAll('input[required], textarea[required]').forEach(input => {
  input.addEventListener('blur', () => {
    input.style.borderColor = input.value.trim() ? '#86efac' : '#fca5a5';
  });
  input.addEventListener('focus', () => input.style.borderColor = '');
});
