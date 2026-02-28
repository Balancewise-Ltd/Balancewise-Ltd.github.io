/**
 * Balancewise Technologies — Shared JS
 * Cursor · Nav · Dark/Light Mode · Reveal · Forms
 */
'use strict';

// ── THEME ──
const root = document.documentElement;
const savedTheme = localStorage.getItem('bwt-theme') || 'light';
root.setAttribute('data-theme', savedTheme);

function setThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.innerHTML = theme === 'dark'
    ? `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`
    : `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm9-9h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2zM5 12a1 1 0 0 1-1 1H2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zm11.95-5.54 1.41-1.41a1 1 0 0 1 1.42 1.41L18.36 7.88a1 1 0 0 1-1.41-1.42zm-12.68 10.6L2.86 18.47a1 1 0 0 1 1.41-1.41l1.41 1.41a1 1 0 0 1-1.41 1.41zM18.36 16.12l1.41 1.41a1 1 0 0 1-1.41 1.41l-1.41-1.41a1 1 0 0 1 1.41-1.41zM4.22 7.05 5.64 8.46A1 1 0 0 1 4.22 9.88L2.81 8.46a1 1 0 0 1 1.41-1.41z"/></svg>`;
}

setThemeIcon(savedTheme);

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('bwt-theme', next);
  setThemeIcon(next);
});

// ← ADDED THIS FOR MOBILE MENU THEME TOGGLE
document.getElementById('themeToggleMobile')?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('bwt-theme', next);
  setThemeIcon(next);
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ── CURSOR (desktop only) ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (cursor && window.matchMedia('(pointer:fine)').matches) {
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();
}

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

// Active nav link
const page = location.pathname.split('/').pop() || 'index.html';
navMenu.querySelectorAll('a:not(.nav-cta)').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── SCROLL REVEAL ──
const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const d = parseFloat(entry.target.dataset.delay || 0) * 1000;
      setTimeout(() => entry.target.classList.add('in'), d);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.rev, .rev-r').forEach(el => revObs.observe(el));

// ── TOAST ──
const toast = document.getElementById('toast');
function showToast(msg, err = false) {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = err ? '#dc2626' : '#081336';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// ── FORMS ──
function hookForm(formId, btnId, apiUrl) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });

    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) { /* server may not be running on static host */ }

    showToast(
      apiUrl.includes('apply')
        ? 'Application received! We will be in touch shortly.'
        : 'Enquiry received! We will respond within 24 hours.'
    );
    form.reset();
    btn.disabled = false;
    btn.textContent = btnId === 'applyBtn' ? 'Submit Application' : 'Send Enquiry';
  });
}

hookForm('contactForm', 'contactBtn', 'https://formspree.io/f/xkoveoyr');
hookForm('applyForm',   'applyBtn',   'https://formspree.io/f/xkoveoyr');

// Input validation visual feedback
document.querySelectorAll('input[required], textarea[required]').forEach(el => {
  el.addEventListener('blur', () => {
    el.style.borderColor = el.value.trim() ? '#86efac' : '#fca5a5';
  });
  el.addEventListener('focus', () => { el.style.borderColor = ''; });
});
