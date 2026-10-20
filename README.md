# Naod Alemu — Portfolio

A static React site, deployed to Vercel. All content lives in JSON under `src/data/`; components never contain project content.

**Stack:** React 19 · Vite 8 · Tailwind CSS 3 · React Router 8 · Lucide icons · EmailJS (contact form) · self-hosted fonts (Instrument Sans, Instrument Serif, JetBrains Mono). No animation library — motion uses CSS, IntersectionObserver and the View Transitions API.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 20.19+ or 22.12+) |
| `npm run dev` | Development server at http://localhost:5173 — drafts are previewable here |
| `npm run dev:demo` | Same, with fictional demo projects from `demo/` to preview the design (red badge on screen) |
| `npm run dev:fixtures` | Same, with edge-case test content from `fixtures/` |
| `npm run validate` | Check all content files and every referenced image |
| `npm run images` | Convert screenshots in `assets-src/projects/` to WebP in `public/projects/` |
| `npm run lint` | ESLint |
| `npm run build` | Production build into `dist/` (fails on content errors) |
| `npm run preview` | Serve the production build locally |
| `npm run check` | validate + lint + build — run before pushing |

## Content

| File | Holds |
|---|---|
| `src/data/site.json` | Name, title, bio, links, email, résumé path, domain, SEO defaults, credentials, impact figures, capabilities, contact copy, EmailJS IDs |
| `src/data/projects.json` | Every project — see **PROJECT_CONTENT_GUIDE.md** |
| `src/data/testimonials.json` | Client quotes. Empty array = section hidden |
| `src/data/experience.json` | Employment history. Empty array = list hidden |

Empty strings hide things: no `email` → no email link; no `linkedin` → no LinkedIn link; no `resume` → no Résumé link; no `availability` → no availability line.

### Projects at a glance

- `"published": false` — the project exists only in `npm run dev` (with a "Draft preview" banner). Production builds strip it from the JavaScript and delete its `public/projects/<slug>/` folder from `dist/`, and `/work/<slug>` returns a 404.
- `"published": true` — gets a case-study page at `/work/<slug>` and appears in the work index.
- `"featured": true` — also gets a large preview in **Selected work** on the homepage, ordered by `sortOrder`.

Full schema, image naming and a step-by-step checklist: [PROJECT_CONTENT_GUIDE.md](PROJECT_CONTENT_GUIDE.md).

### Validation

Content is validated with Zod at build time only (it never ships to the browser):

- `npm run validate` prints every error and warning, then exits non-zero on errors.
- `npm run dev` keeps running with an invalid project — it's left out and the reason is printed in the terminal.
- `npm run build` refuses to build while any content error exists. A missing image file is the exception: the build shows a placeholder and warns, while `npm run validate` treats it as an error.

It catches misspelled field names, duplicate ids/slugs, bad URLs, remote image URLs, metrics without context, HTML inside text, and missing image files.

## How it is built

```
plugins/content.js        Vite plugin: loads + validates JSON, measures images, strips drafts,
                          writes per-route HTML, 404.html, sitemap.xml, robots.txt
src/content.js            The validated content, imported by components
src/utils/
  contentValidation.js    Zod schemas (Node only)
  projectHelpers.js       Sorting, filtering, stack layers, links — all project logic
src/layouts/              Header, footer, page shell
src/sections/             Homepage sections
src/pages/                Home, case study (lazy-loaded), 404
src/components/           Shared pieces: images, stack diagram, gallery, metrics, form
src/hooks/                Scroll reveal, document metadata, local time
scripts/                  validate-content.js, optimize-images.js
```

**Routing and Vercel.** The build writes a real `dist/work/<slug>/index.html` for each published project, with that project's title, description, Open Graph tags and structured data. Vercel serves those files directly, so links and refreshes work without SPA rewrites, and unknown or unpublished paths get a real 404 status from `dist/404.html`.

**Images.** The content plugin reads each image's dimensions at build time, so every `<img>` has `width`/`height` and the page never jumps. If `name-960w.webp` exists next to `name.webp`, a `srcset` is generated automatically. Images below the first screen are lazy-loaded.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project**, import the repository. The included `vercel.json` sets the build command (`npm run build`) and output (`dist`). No environment variables are required.
3. After the first deploy, put the production URL (no trailing slash) in `site.json → url` and redeploy. That turns on canonical URLs, absolute `og:image` links and `sitemap.xml`.

`npm run build` always uses `src/data/` only — demo and fixture content can never reach production.

Every push to the production branch redeploys. Adding a project = edit JSON + add images + commit + push.

## Contact form

The form posts to EmailJS from the browser using the IDs in `site.json → contact.emailjs`. These are public identifiers by design (they are visible in any EmailJS site's JavaScript), not secrets. Protect the account in the EmailJS dashboard: restrict allowed origins to your domain and enable rate limiting or CAPTCHA.

The form's field names must match the template variables: `senderName`, `senderEmail`, `messageSubject`, `contactMessage`. Remove any of the three IDs to hide the form and fall back to the email link.
