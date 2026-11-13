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
const fields = ['name', 'email', 'message'];

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
    showError(field, 'Please enter your ' + (field === 'name' ? 'name.' : field === 'email' ? 'email address.' : 'message.'));
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
  showError(field, '');
  return true;
}

fields.forEach((field) => {
  document.querySelector(`#${field}`)?.addEventListener('input', () => {
    validateField(field);
    if (status) status.textContent = 'This form validates your details in the browser; it does not send messages yet.';
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const results = fields.map(validateField);
  if (results.every(Boolean)) {
    if (status) status.textContent = 'Your details look good. The form is not connected to a message service yet, so please contact me by phone or WhatsApp.';
  } else {
    status.textContent = 'Please correct the highlighted fields.';
    document.querySelector('[aria-invalid="true"]')?.focus();
  }
});

const sections = document.querySelectorAll('main section[id]');
const sectionLinks = document.querySelectorAll('.nav-link');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
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
