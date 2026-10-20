# Bothra Buildtech

Frontend-only React website built with Vite, React Router, Tailwind CSS, AOS, Lenis, GSAP, and Lucide React.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

The Playwright suite covers route rendering across Chromium, Firefox, WebKit, and mobile Chromium. The responsive viewport-resize check runs in desktop Chromium; Firefox's Playwright build hangs when changing viewport size in this environment.

## Structure

- `src/pages/` — lazy-loaded route pages
- `src/components/layout/` — shared header, mega menu, fullscreen navigation, and footer
- `src/components/ui/` — reusable buttons and page hero
- `src/data/` — local project, business, founder, and FAQ data
- `src/data/imageGallery.js` — categorized local image references for the visual library
- `src/context/` — persisted light/dark theme
- `src/styles/` — design tokens, base styles, shared layout, and animations
- `tests/e2e/` — Playwright browser coverage

## Content readiness

No approved founder profiles, project records, office details, phone/email, legal copy, or verified company history were supplied. The UI uses explicit pending-verification states and leaves the project/founder datasets empty rather than publishing invented claims. Business names and official URLs were supplied for review; affiliation with Bothra Buildtech remains unconfirmed.

Testimonial cards currently contain conspicuously labeled fictional sample content and are not real client endorsements. Replace them with verified, permission-approved quotes before launch.

The 19 images in `public/` are local editorial references, not verified Bothra Buildtech project or business photos. Replace them with approved brand imagery before launch. Confirm the production domain before publishing canonical URLs or populating `public/sitemap.xml`. Configure an approved recipient address for the contact form's `mailto:` fallback before launch.
