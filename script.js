const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');

menuToggle?.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
  navLinks?.classList.toggle('hidden', !willOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation menu');
    navLinks?.classList.add('hidden');
  });
});

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const endpoint = form?.dataset.formspreeEndpoint?.trim() ?? '';
const fields = ['name', 'email', 'message'];
const messageUrlPattern = /(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|net|org|io|co|info|biz|xyz|me|app|dev|ke)\b/i;
const cooldownKey = 'portfolio-contact-last-success';
const cooldownMs = 60 * 60 * 1000;
const turnstileBox = form?.querySelector('.cf-turnstile');
if (turnstileBox?.dataset.sitekey?.trim()) {
  const turnstileScript = document.createElement('script');
  turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  turnstileScript.async = true;
  turnstileScript.defer = true;
  document.head.append(turnstileScript);
}

function showError(field, message) {
  const input = document.querySelector(`#${field}`);
  const error = document.querySelector(`#${field}-error`);
  if (!input || !error) return;
  error.textContent = message;
  error.classList.toggle('hidden', !message);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (message) input.setAttribute('aria-describedby', `${field}-error`);
  else input.removeAttribute('aria-describedby');
}

function validateField(field) {
  const input = document.querySelector(`#${field}`);
  const value = input?.value.trim() ?? '';
  if (!value) {
    showError(field, `Please enter your ${field === 'name' ? 'name' : field === 'email' ? 'email address' : 'message'}.`);
    return false;
  }
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(field, 'Enter a valid email address, such as name@example.com.');
    return false;
  }
  if (field === 'message' && value.length < 10) {
    showError(field, 'Please add a little more detail (at least 10 characters).');
    return false;
  }
  if (field === 'message' && messageUrlPattern.test(value)) {
    showError(field, 'Please remove web links from your message and try again.');
    return false;
  }
  showError(field, '');
  return true;
}

fields.forEach((field) => {
  document.querySelector(`#${field}`)?.addEventListener('input', () => {
    validateField(field);
    if (status) status.textContent = '';
  });
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    if (status) status.textContent = 'Please correct the highlighted fields.';
    document.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  if (form.querySelector('[name="_gotcha"]')?.value) return;
  if (!endpoint) {
    if (status) status.textContent = 'The contact form is not configured yet. Please email me directly.';
    return;
  }
  const siteKey = turnstileBox?.dataset.sitekey?.trim() ?? '';
  if (!siteKey) {
    if (status) status.textContent = 'The contact form is being secured. Please email me directly for now.';
    return;
  }
  const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;
  if (!turnstileToken) {
    if (status) status.textContent = 'Please complete the security check and try again.';
    return;
  }
  let lastSentAt = 0;
  try { lastSentAt = Number(localStorage.getItem(cooldownKey) || 0); } catch { /* Browser storage may be disabled. */ }
  const waitMs = cooldownMs - (Date.now() - lastSentAt);
  if (waitMs > 0) {
    const minutes = Math.ceil(waitMs / 60000);
    if (status) status.textContent = `A message was already sent from this browser recently. Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  if (status) status.textContent = 'Sending your message…';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Form submission failed');
    try { localStorage.setItem(cooldownKey, String(Date.now())); } catch { /* Keep the successful submission even when storage is disabled. */ }
    form.reset();
    fields.forEach((field) => showError(field, ''));
    if (status) status.textContent = 'Thank you. Your message has been sent.';
  } catch {
    if (status) status.textContent = 'Your message could not be sent. Please try again or email me directly.';
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

const sections = document.querySelectorAll('main section[id]');
const sectionLinks = document.querySelectorAll('.nav-link');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const target = link.getAttribute('href')?.split('#').pop();
        const active = target === entry.target.id && link.href.includes('#');
        link.classList.toggle('text-gold', active);
        link.classList.toggle('font-semibold', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -65% 0px' });
  sections.forEach((section) => observer.observe(section));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
