/**
 * Balancewise Technologies — Shared JS
 * Cursor · Nav · Dark/Light Mode · Reveal · Forms
 */
'use strict';

// ── THEME ──
const root = document.documentElement;
let savedTheme = 'light';
try { if (localStorage.getItem('bwt-theme') === 'dark') savedTheme = 'dark'; } catch {}
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
  try { localStorage.setItem('bwt-theme', next); } catch {}
  setThemeIcon(next);
});

// ← ADDED THIS FOR MOBILE MENU THEME TOGGLE
document.getElementById('themeToggleMobile')?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('bwt-theme', next); } catch {}
  setThemeIcon(next);
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Native pointer and keyboard navigation.
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
function setMenu(open, restoreFocus = false) {
  hamburger?.classList.toggle('open', open);
  hamburger?.setAttribute('aria-expanded', String(open));
  hamburger?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navMenu?.classList.toggle('open', open);
  if (restoreFocus) hamburger?.focus();
}
hamburger?.addEventListener('click', () => setMenu(hamburger.getAttribute('aria-expanded') !== 'true'));
navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => { if (!navbar?.contains(event.target)) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && hamburger?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
navMenu?.querySelectorAll('a:not(.nav-cta)').forEach(a => {
  if (new URL(a.href).pathname === location.pathname) a.setAttribute('aria-current', 'page');
});
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', event => {
  const target = document.getElementById(a.getAttribute('href').slice(1));
  if (!target) return;
  event.preventDefault();
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));

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

// Input validation visual feedback
document.querySelectorAll('input[required], textarea[required]').forEach(el => {
  el.addEventListener('blur', () => {
    el.style.borderColor = el.value.trim() ? '#86efac' : '#fca5a5';
  });
  el.addEventListener('focus', () => { el.style.borderColor = ''; });
});
