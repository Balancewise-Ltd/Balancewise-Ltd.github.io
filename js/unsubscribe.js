"use strict";
(() => {
  const message = document.getElementById('unsubscribe-message');
  const button = document.getElementById('unsubscribe-confirm');
  const token = new URLSearchParams(location.hash.slice(1)).get('token') || '';
  // A fragment keeps the signed opt-out token out of server logs and referrers.
  if (location.hash) history.replaceState(null, '', location.pathname);
  if (!token || token.length > 1024) {
    message.textContent = 'Open the unsubscribe link from your email, or change your email preferences in your account.';
    return;
  }
  message.textContent = 'Confirm below to stop the optional emails covered by this link. You do not need to sign in.';
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    message.textContent = 'Saving your preference…';
    try {
      const response = await fetch('https://api-bscan.balancewises.io/api/email/unsubscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', referrerPolicy: 'no-referrer', body: JSON.stringify({ token })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.detail === 'string' ? result.detail : 'We could not save your preference. Try again or contact info@balancewises.io.');
      message.textContent = result.message;
      button.hidden = true;
    } catch (error) {
      message.textContent = error.message || 'Connection failed. Try again or contact info@balancewises.io.';
      button.disabled = false;
    }
  });
})();
