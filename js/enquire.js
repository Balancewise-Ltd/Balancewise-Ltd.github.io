const API_BASE = 'https://api-bscan.balancewises.io';
const LEAD_ENDPOINT = `${API_BASE}/api/company-leads`;
const CONFIG_ENDPOINT = `${LEAD_ENDPOINT}/config`;
const PRIVACY_URL = 'https://balancewises.io/privacy/';

const PATH = {
  TALENT: 'Hire IT talent',
  SERVICES: 'Build software or a website',
  JOIN: 'Work with us (join the team)'
};

const PATH_TYPE = {
  [PATH.TALENT]: 'talent',
  [PATH.SERVICES]: 'services',
  [PATH.JOIN]: 'applicant'
};

const ROUTER = {
  id: 'need',
  eyebrow: 'What you need',
  title: 'How can we help?',
  sub: 'Pick one. The next questions adapt to your choice.',
  options: [PATH.TALENT, PATH.SERVICES, PATH.JOIN]
};

const BRANCHES = {
  [PATH.TALENT]: [
    {
      id: 'roles',
      eyebrow: 'Talent',
      title: 'Which specialists do you need?',
      options: ['Backend developer', 'DevOps engineer', 'Data analyst', 'ML / AI professional', 'Cloud specialist', 'Multiple / not sure']
    },
    {
      id: 'engagement',
      eyebrow: 'Engagement',
      title: 'How do you want to engage them?',
      options: ['Temporary contract', 'Permanent placement', 'Freelance / project', 'Not sure yet']
    },
    {
      id: 'timeline',
      eyebrow: 'Timing',
      title: 'When do you need them?',
      sub: 'A range is fine.',
      options: ['As soon as possible', 'Within 1-3 months', '3-6 months', 'Just exploring']
    }
  ],
  [PATH.SERVICES]: [
    {
      id: 'service',
      eyebrow: 'The build',
      title: 'What do you want built?',
      options: ['Website', 'Web app', 'Custom backend / API', 'Cloud & infrastructure', 'AI in the workplace', 'Data & analytics']
    },
    {
      id: 'scope',
      eyebrow: 'Scope',
      title: "What's the scope?",
      options: ['New build from scratch', 'Improve an existing product', 'One-off audit or fix', 'Ongoing tech partner']
    },
    {
      id: 'timeline',
      eyebrow: 'Timing',
      title: 'When do you want it live?',
      sub: 'A range is fine.',
      options: ['As soon as possible', 'Within 1-3 months', '3-6 months', 'Just exploring']
    }
  ],
  [PATH.JOIN]: [
    {
      id: 'discipline',
      eyebrow: 'Your craft',
      title: "What's your discipline?",
      options: ['Frontend / web', 'Backend / APIs', 'DevOps / infrastructure', 'Data / ML', 'Cloud', 'Something else']
    },
    {
      id: 'availability',
      eyebrow: 'Availability',
      title: 'How do you want to work?',
      options: ['Temporary contract', 'Permanent role', 'Freelance / project', 'Open-source contributor']
    }
  ]
};

const answers = {};
const contact = { name: '', email: '', phone: '', company: '', link: '' };
const KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
const view = document.getElementById('view');
const scanFill = document.getElementById('scanFill');
const stepCount = document.getElementById('stepCount');
const formStatus = document.getElementById('formStatus');
const configPromise = fetch(CONFIG_ENDPOINT, { headers: { Accept: 'application/json' } })
  .then((response) => {
    if (!response.ok) throw new Error('Lead intake configuration is unavailable');
    return response.json();
  });

let stepIndex = 0;
let turnstileWidgetId = null;
let turnstileToken = '';

const isApplicant = () => answers.need === PATH.JOIN;
const branch = () => BRANCHES[answers.need] || [];
const flow = () => [ROUTER, ...branch()];
const total = () => flow().length + 1;
const esc = (value) => String(value).replace(/[&<>"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
})[character]);

function progressPct() {
  if (stepIndex === 0) return 4;
  return Math.round((Math.min(stepIndex, total()) / (total() + 0.4)) * 100);
}

function setChrome() {
  scanFill.style.width = `${progressPct()}%`;
  stepCount.textContent = stepIndex >= 1 && stepIndex <= total()
    ? `STEP ${String(stepIndex).padStart(2, '0')} / ${String(total()).padStart(2, '0')}`
    : '';
}

function render() {
  setChrome();
  const questions = flow();
  if (stepIndex === 0) return renderIntro();
  if (stepIndex >= 1 && stepIndex <= questions.length) return renderQuestion(questions[stepIndex - 1]);
  if (stepIndex === questions.length + 1) return renderContact();
  return renderDone();
}

function renderIntro() {
  view.innerHTML = `
    <div class="step center">
      <div class="glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2 5 4-13 2 8h6"/></svg>
      </div>
      <div class="eyebrow">Enquiry intake</div>
      <h1>Expert IT talent and technology, on demand.</h1>
      <p class="sub intro-sub">A few quick choices, then your details. A person from our team replies within one working day.</p>
      <button class="cta" id="startBtn" type="button">Start</button>
      <div class="meta">Newcastle &middot; UK-wide &middot; VAT and ICO registered</div>
    </div>`;
  document.getElementById('startBtn').onclick = () => go(1);
}

function renderQuestion(question) {
  const chosen = answers[question.id];
  view.innerHTML = `
    <div class="step">
      <div class="eyebrow">${esc(question.eyebrow || '')}</div>
      <h1>${esc(question.title)}</h1>
      ${question.sub ? `<p class="sub">${esc(question.sub)}</p>` : '<div class="question-spacer"></div>'}
      <div class="options">
        ${question.options.map((option, index) => `
          <button class="opt ${chosen === option ? 'is-selected' : ''}" type="button" data-val="${esc(option)}">
            <span class="opt__key">${KEYS[index]}</span>
            <span class="opt__label">${esc(option)}</span>
            <span class="opt__arrow" aria-hidden="true">&rarr;</span>
          </button>`).join('')}
      </div>
      <div class="nav"><button class="back" id="backBtn" type="button">&larr; Back</button></div>
    </div>`;

  view.querySelectorAll('.opt').forEach((button) => {
    button.onclick = () => {
      const switchedPath = question.id === ROUTER.id
        && answers[question.id]
        && answers[question.id] !== button.dataset.val;
      answers[question.id] = button.dataset.val;
      if (switchedPath) {
        Object.keys(answers).forEach((key) => {
          if (key !== ROUTER.id) delete answers[key];
        });
      }
      view.querySelectorAll('.opt').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      window.setTimeout(() => go(stepIndex + 1), 220);
    };
  });
  document.getElementById('backBtn').onclick = () => go(stepIndex - 1);
}

function renderContact() {
  const applicant = isApplicant();
  turnstileWidgetId = null;
  turnstileToken = '';
  view.innerHTML = `
    <div class="step">
      <div class="eyebrow">Almost done</div>
      <h1>${applicant ? 'Where do we reach you?' : 'Where do we send it?'}</h1>
      <p class="sub">${applicant ? 'So our team can review your interest and respond.' : 'So we can review your scope and arrange the next conversation.'}</p>
      <input class="hp" type="text" id="f-website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field">
        <label for="f-name">Full name <span class="req">*</span></label>
        <input id="f-name" type="text" maxlength="120" autocomplete="name" placeholder="Alex Doe" value="${esc(contact.name)}">
        <div class="err" id="e-name">Enter your name.</div>
      </div>
      <div class="field">
        <label for="f-email">Email <span class="req">*</span></label>
        <input id="f-email" type="email" maxlength="254" inputmode="email" autocomplete="email" placeholder="you@company.com" value="${esc(contact.email)}">
        <div class="err" id="e-email">Enter a valid email address.</div>
      </div>
      <div class="field">
        <label for="f-phone">Phone <span class="req">*</span></label>
        <input id="f-phone" type="tel" maxlength="40" inputmode="tel" autocomplete="tel" placeholder="+44 7700 900000" value="${esc(contact.phone)}">
        <div class="err" id="e-phone">Enter a valid phone number.</div>
      </div>
      <div class="field">
        <label for="f-company">Company <span class="optional">(optional)</span></label>
        <input id="f-company" type="text" maxlength="160" autocomplete="organization" placeholder="${applicant ? 'Current employer' : 'Company or project name'}" value="${esc(contact.company)}">
      </div>
      ${applicant ? `
        <div class="field">
          <label for="f-link">GitHub, portfolio or CV link <span class="optional">(optional)</span></label>
          <input id="f-link" type="url" maxlength="500" inputmode="url" placeholder="https://github.com/you" value="${esc(contact.link)}">
        </div>` : ''}
      <label class="consent" id="consentLabel">
        <input type="checkbox" id="f-consent">
        <span>I have read the <a href="${PRIVACY_URL}" target="_blank" rel="noopener">privacy policy</a> and agree to be contacted about this enquiry.</span>
      </label>
      <div class="turnstile-box" id="turnstile-widget" aria-label="Human verification"></div>
      <p class="verification-error hidden" id="verificationError"></p>
      <button class="cta" id="submitBtn" type="button">${applicant ? 'Send my application' : 'Send my enquiry'}</button>
      <div class="nav"><button class="back" id="backBtn" type="button">&larr; Back</button></div>
    </div>`;

  const bind = (id, key) => {
    const element = document.getElementById(id);
    if (element) element.addEventListener('input', (event) => { contact[key] = event.target.value; });
  };
  bind('f-name', 'name');
  bind('f-email', 'email');
  bind('f-phone', 'phone');
  bind('f-company', 'company');
  bind('f-link', 'link');
  document.getElementById('backBtn').onclick = () => go(stepIndex - 1);
  document.getElementById('submitBtn').onclick = submitLead;
  renderVerification();
}

async function renderVerification() {
  const error = document.getElementById('verificationError');
  try {
    const config = await configPromise;
    if (!window.turnstile || !config.turnstile_site_key) throw new Error('Verification unavailable');
    turnstileWidgetId = window.turnstile.render('#turnstile-widget', {
      sitekey: config.turnstile_site_key,
      action: 'company_lead',
      theme: 'auto',
      size: 'flexible',
      appearance: 'interaction-only',
      callback: (token) => {
        turnstileToken = token;
        error.classList.add('hidden');
      },
      'expired-callback': () => {
        turnstileToken = '';
      },
      'error-callback': () => {
        turnstileToken = '';
        error.textContent = 'Human verification could not load. Refresh the page and try again.';
        error.classList.remove('hidden');
      }
    });
  } catch {
    error.textContent = 'The enquiry service is temporarily unavailable. Please email info@balancewises.io.';
    error.classList.remove('hidden');
    document.getElementById('submitBtn').disabled = true;
  }
}

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const validPhone = (value) => {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[+\d][\d\s().-]{5,39}$/.test(value.trim());
};

function validateContact() {
  let valid = true;
  const check = (inputId, errorId, passes) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.toggle('invalid', !passes);
    error.classList.toggle('show', !passes);
    if (!passes) valid = false;
  };
  check('f-name', 'e-name', Boolean(contact.name.trim()));
  check('f-email', 'e-email', validEmail(contact.email));
  check('f-phone', 'e-phone', validPhone(contact.phone));
  const consent = document.getElementById('f-consent').checked;
  document.getElementById('consentLabel').classList.toggle('invalid', !consent);
  return valid && consent;
}

async function submitLead() {
  if (document.getElementById('f-website').value.trim()) {
    go(flow().length + 2);
    return;
  }
  if (!validateContact()) return;

  const verificationError = document.getElementById('verificationError');
  if (!turnstileToken) {
    verificationError.textContent = 'Complete the human verification before sending.';
    verificationError.classList.remove('hidden');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const payload = {
    type: PATH_TYPE[answers.need],
    contact: {
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      company: contact.company.trim(),
      link: contact.link.trim() || null,
      consent: true
    },
    answers,
    source_path: window.location.pathname,
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    website: '',
    turnstile_token: turnstileToken
  };

  const button = document.getElementById('submitBtn');
  button.disabled = true;
  button.textContent = 'Sending...';
  formStatus.textContent = 'Sending your enquiry.';

  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || (response.status === 429
        ? 'Too many attempts. Please wait and try again.'
        : 'Your enquiry could not be sent.'));
    }
    formStatus.textContent = 'Your enquiry was received.';
    go(flow().length + 2);
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Try again';
    verificationError.textContent = error.message || 'Your enquiry could not be sent. Please try again.';
    verificationError.classList.remove('hidden');
    turnstileToken = '';
    if (window.turnstile && turnstileWidgetId !== null) {
      window.turnstile.reset(turnstileWidgetId);
    }
    formStatus.textContent = verificationError.textContent;
  }
}

function renderDone() {
  const applicant = isApplicant();
  const firstName = contact.name.trim().split(/\s+/)[0] || '';
  view.innerHTML = `
    <div class="step center success">
      <div class="glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div class="eyebrow">Received</div>
      <h1>${applicant ? 'Application received.' : "You're in. We'll be in touch."}</h1>
      <p class="sub done-sub">Thanks ${esc(firstName)}. This is with our team and we aim to reply within one working day.</p>
      <div class="meta">Sent securely to Balancewise &middot; <b>${esc(contact.email)}</b></div>
    </div>`;
  stepCount.textContent = '';
  scanFill.style.width = '100%';
}

function go(index) {
  stepIndex = index;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('keydown', (event) => {
  const questions = flow();
  if (stepIndex < 1 || stepIndex > questions.length) return;
  const question = questions[stepIndex - 1];
  const key = event.key.toUpperCase();
  let index = KEYS.includes(key) ? KEYS.indexOf(key) : -1;
  if (/^[1-9]$/.test(event.key)) index = Number(event.key) - 1;
  if (index >= 0 && index < question.options.length) {
    const button = view.querySelectorAll('.opt')[index];
    if (button) button.click();
  }
});

render();
