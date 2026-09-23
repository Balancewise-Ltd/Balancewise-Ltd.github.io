"use strict";
// No optional analytics or advertising scripts are loaded by this site.
(() => {
  const noticeStorageName = 'balancewise-privacy-v1';
  const version = '2026-09-23';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let remembered = false;
  try {
    const saved = JSON.parse(localStorage.getItem(noticeStorageName) || 'null');
    remembered = saved?.version === version && saved.expires > Date.now();
    localStorage.removeItem('bwt-consent');
  } catch { /* The notice works when storage is unavailable. */ }
  const banner = document.createElement('aside');
  banner.className = 'privacy-notice';
  banner.setAttribute('aria-label', 'Cookies and storage');
  banner.innerHTML = '<div><strong>Essential storage only</strong><p>We use storage for site preferences and security. Optional analytics and advertising are off. Read our <a href="https://balancewises.io/cookies/">cookie policy</a>.</p></div><div class="privacy-actions"><button type="button" data-notice-settings>Cookie settings</button><button type="button" data-notice-close>Dismiss</button></div>';
  banner.hidden = remembered;
  document.body.append(banner);
  const dialog = document.createElement('dialog');
  dialog.className = 'privacy-dialog';
  dialog.setAttribute('aria-labelledby', 'privacy-dialog-title');
  dialog.innerHTML = '<h2 id="privacy-dialog-title">Cookie settings</h2><p>Essential storage supports security, sign-in and the preferences you choose. It is always on.</p><p><strong>Optional analytics and advertising: off.</strong> These features are not enabled, so there are no optional cookies to accept.</p><p>Dismissing this notice saves your acknowledgement for six months on this browser. It does not give marketing permission.</p><p><a href="https://balancewises.io/cookies/">Cookie policy</a> · <a href="https://balancewises.io/privacy/">Privacy policy</a></p><form method="dialog"><button type="submit" autofocus>Close settings</button></form>';
  document.body.append(dialog);
  let opener;
  function openSettings(event) {
    opener = event?.currentTarget || document.activeElement;
    if (!dialog.open) dialog.showModal();
  }
  dialog.addEventListener('close', () => opener?.focus());
  banner.querySelector('[data-notice-settings]').addEventListener('click', openSettings);
  document.addEventListener('click', event => { const button = event.target.closest?.('[data-cookie-settings]'); if (button) openSettings({currentTarget: button}); });
  document.addEventListener('balancewise:cookie-settings', () => openSettings());
  banner.querySelector('[data-notice-close]').addEventListener('click', () => {
    try { localStorage.setItem(noticeStorageName, JSON.stringify({ version, expires: Date.now() + lifetime })); } catch { /* Memory-only dismissal. */ }
    banner.hidden = true;
    document.querySelector('main')?.focus({ preventScroll: true });
  });
})();
