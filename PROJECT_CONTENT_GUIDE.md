# Project Content Guide

How to gather material for a project, add it to the site, and publish it. Nothing here requires editing a component.

## 1. Collect the facts first

Answer these before writing JSON. Leave anything you can't verify blank — every field except `id`, `slug`, `title` and `description` is optional, and empty fields are hidden.

- [ ] **Repository URL** — and whether the source is public. Never list a private repository.
- [ ] **Live URL**, if it's still online.
- [ ] **Project name and year.**
- [ ] **What it does**, in two or three plain sentences.
- [ ] **Who it was for** — and whether you may name them. If not, write a neutral descriptor ("a retail company in Addis Ababa").
- [ ] **Your exact role.** Solo build? Backend only? Say precisely what was yours.
- [ ] **The problem** it solved or the requirement you were given.
- [ ] **The two or three most important technical decisions** and what you traded off.
- [ ] **Main technologies.**
- [ ] **The hardest engineering challenge** and how you solved it.
- [ ] **Results you can back up** — measured numbers, with what/where/how they were measured.
- [ ] **Screenshots** (see section 3).
- [ ] **Can it be discussed publicly?** Check client agreements/NDAs.
- [ ] **Should it be featured?** Feature your 3–5 strongest projects only.

Don't guess. A shorter, accurate case study is better than a padded one.

## 2. Add the project

1. Open `src/data/projects.json`.
2. Copy the `example-project` object, paste it as a new entry in the array, and edit it.
3. Set `id` and `slug` to the same lowercase-hyphenated name, e.g. `"shop-checkout"`. The slug becomes the URL: `/work/shop-checkout`.
4. Put images in `public/projects/<slug>/` (see section 3).
5. Run `npm run validate` and fix anything it reports.
6. Run `npm run dev` and open `http://localhost:5173/work/<slug>` — drafts are viewable in dev with a banner.
7. When it's ready: `"published": true` (and `"featured": true` if it belongs on the homepage). Commit and push.

### Publishing states

| `published` | `featured` | Result in production |
|---|---|---|
| `false` | any | Does not exist. Not in the JavaScript, images removed from the build, URL is a 404. |
| `true` | `false` | Case-study page + listed in the homepage work index. |
| `true` | `true` | Also a large preview in Selected work. Order with `sortOrder` (1 = first). |

To unpublish, set `"published": false` and redeploy.

## 3. Screenshots

### Folder and names

```
public/projects/<slug>/
  cover.webp            required for a good preview — 16:10, 2400px wide
  desktop-01.webp       full desktop screens
  mobile-01.webp        phone screens (portrait)
  detail-01.webp        cropped interface details
  before-01.webp / after-01.webp   before/after pairs (same size)
  *-960w.webp           smaller copies — generated for you, used automatically on phones
```

### Preparing them

1. Capture at 2× device pixel ratio where possible (sharper UI text).
2. Put the **originals** in `assets-src/projects/<slug>/` (this folder is git-ignored, so keep your own backup).
3. Run `npm run images`. It writes WebP files to `public/projects/<slug>/` at up to 2400px wide, plus a 960px version for phones. Quality is set high so UI text stays readable.
4. Reference the `.webp` files in JSON (never the `-960w` ones — those are picked up automatically).

Images must be local paths starting with `/`. Remote URLs (including GitHub raw links) are rejected.

### Before you publish a screenshot

Check every screenshot for **customer names, emails, phone numbers, addresses, order data, credentials, API keys, internal dashboards or revenue figures.** Blur or replace them with demo data. If in doubt, leave the image out.

### Writing image entries

An image can be a plain path or an object with alt text and a caption:

```json
"cover": "/projects/shop-checkout/cover.webp",
"desktop": [
  { "src": "/projects/shop-checkout/desktop-01.webp", "alt": "Checkout page with order summary", "caption": "The one-page checkout." }
],
"mobile": ["/projects/shop-checkout/mobile-01.webp", "/projects/shop-checkout/mobile-02.webp"],
"gallery": [
  { "src": "/projects/shop-checkout/detail-01.webp", "kind": "detail", "alt": "Address autocomplete dropdown" }
],
"beforeAfter": [
  { "before": "/projects/shop-checkout/before-01.webp", "after": "/projects/shop-checkout/after-01.webp", "label": "Product page", "caption": "Same page, same data." }
],
"video": { "src": "/projects/shop-checkout/demo.mp4", "poster": "/projects/shop-checkout/demo-poster.webp", "caption": "" }
```

`kind` is one of `desktop`, `mobile`, `detail`, `full`. `frame` (on an image or in `presentation`) is `auto`, `browser`, `device` or `none` — `auto` puts phones in a device frame and leaves desktop screens unframed. Videos never autoplay. Missing images show a neutral placeholder and a validation error.

## 4. Field reference

| Field | Notes |
|---|---|
| `id`, `slug` | Unique, lowercase-hyphenated. Usually identical. |
| `title` | Project name. |
| `subtitle` | One positioning sentence; shown under the title and used as the page description. |
| `description` | 2–3 sentences for the homepage preview. **Required.** |
| `featured`, `published`, `sortOrder` | See publishing states. |
| `year`, `duration` | `"2025"`, `"4 months"`. |
| `category` | e.g. `SaaS`, `E-commerce`, `API`, `Internal tool`. |
| `projectType` | e.g. `Client`, `Freelance`, `Employment`, `Personal`, `Open source`. |
| `status` | e.g. `Live`, `Completed`, `In development`. |
| `role` | Your role, precisely. |
| `client` | `name` is shown only if `disclose` is `true`; otherwise `descriptor` is shown. |
| `team` | e.g. `["1 designer", "2 developers"]`. |
| `overview`, `problem`, `approach`, `solution` | Plain text. Separate paragraphs with a blank line (`\n\n`). |
| `contributions`, `results`, `lessons`, `constraints` | Lists of plain strings. |
| `features` | Strings, or `{ "title", "description" }`. |
| `decisions` | `{ "title", "description", "tradeoff" }` — the "how I think" part. |
| `challenges` | `{ "title", "description" }`. |
| `techStack` | Strings (`"Laravel"`), or `{ "name", "layer" }` to place an unknown tool. Layers: `interface`, `application`, `data`, `infrastructure`, `tooling`. Drives the stack diagram. |
| `metrics` | `{ "label", "value", "unit", "before", "context" }`. **`context` is required** — say what was measured, where and how. The first metric appears on the homepage preview. |
| `links` | `live`, `github`, `caseStudy`, `figma`. Empty strings are hidden. |
| `visibility` | Hide the live link, GitHub link, metrics or gallery without deleting data (e.g. while a client approves). |
| `presentation.caseStudy` | `visual` (screens before engineering notes) or `technical` (decisions and challenges first — good for backend-heavy work). |
| `presentation.accent` | Optional hex colour for the phone-screens band and placeholders, e.g. `"#2F5D50"`. Pick a muted colour. |
| `related` | Slugs of other projects to link at the end. |

Only plain text is allowed — HTML is rejected by validation.

## 5. Metrics: keep them honest

- Only include numbers you measured or that the client reported to you, and say which in `context`.
- Name the scope: "on the product page", "for the admin dashboard", "on a 4G connection".
- Don't compare two numbers that were measured differently.
- If you can't share a number, describe the result in `results` instead.
