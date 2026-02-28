/**
 * Balancewise Technologies — Cookie Consent Banner
 * Lightweight, GDPR compliant, no third-party dependencies
 */
'use strict';

(function () {
  // Don't show banner if already decided
  if (localStorage.getItem('bwt-consent')) return;

  // Create banner HTML
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = `
    <div class="cb-content">
      <div class="cb-text">
        <strong>🍪 We use cookies</strong>
        <p>We use essential cookies to make our site work, and optional analytics cookies to understand how you use it. See our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.</p>
      </div>
      <div class="cb-actions">
        <button id="cbDecline" class="cb-btn cb-btn-secondary">Essential Only</button>
        <button id="cbAccept"  class="cb-btn cb-btn-primary">Accept All</button>
      </div>
    </div>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #cookieBanner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9000;
      background: var(--navy, #081336);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 1.25rem 5%;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.3);
      animation: cbSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes cbSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .cb-content {
      max-width: 1340px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .cb-text { flex: 1; min-width: 260px; }
    .cb-text strong {
      display: block;
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    .cb-text p {
      color: rgba(255,255,255,0.65);
      font-family: 'Syne', sans-serif;
      font-size: 0.82rem;
      line-height: 1.6;
      margin: 0;
    }
    .cb-text a {
      color: #60a5fa;
      text-decoration: none;
      font-weight: 600;
    }
    .cb-text a:hover { text-decoration: underline; }
    .cb-actions {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    .cb-btn {
      font-family: 'Syne', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.65rem 1.5rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .cb-btn:hover { transform: translateY(-1px); }
    .cb-btn-secondary {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .cb-btn-secondary:hover { background: rgba(255,255,255,0.16); }
    .cb-btn-primary {
      background: #2563eb;
      color: #fff;
    }
    .cb-btn-primary:hover { background: #3b82f6; box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
    @media (max-width: 600px) {
      .cb-content { flex-direction: column; gap: 1rem; }
      .cb-actions { width: 100%; }
      .cb-btn { flex: 1; text-align: center; }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(banner);

  // Accept all — enable analytics
  document.getElementById('cbAccept').addEventListener('click', () => {
    localStorage.setItem('bwt-consent', 'all');
    banner.style.animation = 'none';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(() => banner.remove(), 300);
    // Load Google Analytics if you have it
    // loadAnalytics();
  });

  // Essential only — no analytics
  document.getElementById('cbDecline').addEventListener('click', () => {
    localStorage.setItem('bwt-consent', 'essential');
    banner.style.animation = 'none';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  });
})();

// Uncomment and add your GA ID when ready:
// function loadAnalytics() {
//   const s = document.createElement('script');
//   s.async = true;
//   s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
//   document.head.appendChild(s);
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
// }
