# Yegon J. Caroline Portfolio

Responsive portfolio website for Yegon J. Caroline, a freelance full stack web developer. Built with semantic HTML, Tailwind CSS via CDN, and vanilla JavaScript.

## Live site

https://yegonjcaroline.github.io/yegon-j-caroline-portfolio/

## Run locally

Open `index.html` in a browser, or place this repository in XAMPP `htdocs`. Tailwind CSS and Google Fonts load from their CDNs, so an internet connection is needed for those styles and fonts.

## Projects shown

- Grace Beauty Salon: appointment requests and admin assignment workflow. Built with PHP, MySQL/PDO, and Tailwind CSS. The repository is linked; no public demo was verified.
- ZURI MAISON: furniture catalogue with category filters and a client-side bag confirmation. Built with HTML, Tailwind CSS, and vanilla JavaScript. Live demo and repository links are provided.
- Amani Hospital: public hospital information pages for services, doctors, and contact details. Built with HTML and CSS. Live demo and repository links are provided.

Each project has a dedicated details page. The Maison project page explicitly describes its current shopping flow without claiming a checkout or payment feature.

## Contact form setup

The form submits to the provided Formspree endpoint and includes a Formspree `_gotcha` honeypot, client-side URL rejection, and a one-hour cooldown stored in the submitting browser. The cooldown is only a convenience; it cannot enforce one submission per person because browser storage can be cleared or bypassed.

Cloudflare Turnstile is configured for `yegonjcaroline.github.io`: the Site Key is in the `.cf-turnstile` element and the Secret Key is stored in the Formspree CAPTCHA settings.

The browser-side URL check can also be bypassed by direct requests. For server-side spam handling, add Formspree rules to tag submissions containing link patterns such as `https://`, `http://`, or `www.` as spam. Formspree applies its own global API limits; it does not provide a verified per-person hourly limit in this static setup.

## Project files

- `index.html` - home page and contact form
- `projects.html` - project directory
- `projects/` - individual project details
- `script.js` - navigation, form validation, anti-spam checks, and contact submission
- `assets/` - photos, project previews, and CV PDF
- `.github/workflows/deploy.yml` - GitHub Pages deployment
