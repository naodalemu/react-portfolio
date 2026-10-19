// Content schemas for src/data/*.json.
//
// This module runs in Node only — from the Vite content plugin and from
// `npm run validate` — so Zod never ships to the browser.

import { z } from 'zod'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const HTML_TAG = /<\/?[a-z!][^>]*>/i
const HEX = /^#(?:[0-9a-f]{3}){1,2}$/i

const text = z.string().trim()
const optionalText = text.default('')
// A required, non-empty string with one clear message whether it is missing or blank.
const required = (message) => z.string({ error: message }).trim().min(1, message)
const slug = z.string().regex(SLUG, 'Use lowercase letters, numbers and single hyphens, e.g. "my-project"')

const url = z
  .string()
  .trim()
  .refine((value) => value === '' || /^https?:\/\/\S+$/.test(value), 'Must be a full http(s) URL or ""')
  .default('')

const localPath = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || value.startsWith('/'),
    'Must be a local path starting with "/", e.g. "/projects/my-project/cover.webp". Remote images are not supported.',
  )

const imageObject = z.strictObject({
  src: localPath.refine((value) => value !== '', 'Image "src" is required'),
  alt: optionalText,
  caption: optionalText,
  kind: z.enum(['desktop', 'mobile', 'detail', 'full']).optional(),
  frame: z.enum(['auto', 'browser', 'device', 'none']).default('auto'),
})

// An image can be written as a plain path or as an object with alt text and a caption.
const image = z.union([localPath, imageObject])
const imageList = z.union([image, z.array(image)]).default([])

const projectSchema = z.strictObject({
  id: slug,
  slug,
  title: required('Title is required'),
  subtitle: optionalText,
  description: required('A short description is required for the project preview'),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().default(999),
  year: z.union([text, z.number()]).transform(String).default(''),
  duration: optionalText,
  category: optionalText,
  projectType: optionalText,
  status: optionalText,
  role: optionalText,
  client: z
    .strictObject({
      name: optionalText,
      descriptor: optionalText,
      disclose: z.boolean().default(false),
    })
    .prefault({}),
  team: z.array(text).default([]),
  overview: optionalText,
  problem: optionalText,
  approach: optionalText,
  solution: optionalText,
  contributions: z.array(text).default([]),
  features: z
    .array(z.union([text, z.strictObject({ title: text.min(1), description: optionalText })]))
    .default([]),
  decisions: z
    .array(z.strictObject({ title: text.min(1), description: optionalText, tradeoff: optionalText }))
    .default([]),
  challenges: z.array(z.strictObject({ title: text.min(1), description: optionalText })).default([]),
  techStack: z
    .array(
      z.union([
        text.min(1),
        z.strictObject({
          name: text.min(1),
          layer: z.enum(['interface', 'application', 'data', 'infrastructure', 'tooling']).optional(),
        }),
      ]),
    )
    .default([]),
  metrics: z
    .array(
      z.strictObject({
        label: required('Metric label is required'),
        value: z.union([text.min(1), z.number()]).transform(String),
        unit: optionalText,
        before: z.union([text, z.number()]).transform(String).default(''),
        context: required('Every metric needs context: what was measured, where and how'),
      }),
    )
    .default([]),
  results: z.array(text).default([]),
  lessons: z.array(text).default([]),
  constraints: z.array(text).default([]),
  links: z
    .strictObject({ live: url, github: url, caseStudy: url, figma: url })
    .prefault({}),
  images: z
    .strictObject({
      cover: image.default(''),
      thumbnail: image.default(''),
      desktop: imageList,
      mobile: imageList,
      gallery: imageList,
      beforeAfter: z
        .array(
          z.strictObject({
            before: image,
            after: image,
            label: optionalText,
            caption: optionalText,
          }),
        )
        .default([]),
      video: z
        .strictObject({ src: localPath, poster: localPath.default(''), caption: optionalText })
        .nullable()
        .default(null),
    })
    .prefault({}),
  visibility: z
    .strictObject({
      showLiveLink: z.boolean().default(true),
      showGithubLink: z.boolean().default(true),
      showMetrics: z.boolean().default(true),
      showGallery: z.boolean().default(true),
    })
    .prefault({}),
  presentation: z
    .strictObject({
      caseStudy: z.enum(['visual', 'technical']).default('visual'),
      accent: z
        .string()
        .refine((value) => value === '' || HEX.test(value), 'Accent must be a hex colour like "#2F5D50"')
        .default(''),
      frame: z.enum(['auto', 'browser', 'device', 'none']).default('auto'),
    })
    .prefault({}),
  related: z.array(slug).default([]),
})

const testimonialSchema = z.strictObject({
  id: slug,
  quote: text.min(1),
  name: optionalText,
  role: optionalText,
  organization: optionalText,
  anonymized: z.boolean().default(false),
  projectSlug: z.union([slug, z.literal('')]).default(''),
  url,
  date: optionalText,
  rating: z.number().min(1).max(5).optional(),
  published: z.boolean().default(true),
})

const experienceSchema = z.strictObject({
  id: slug,
  role: text.min(1),
  organization: text.min(1),
  start: text.min(1),
  end: optionalText,
  location: optionalText,
  summary: optionalText,
  url,
  published: z.boolean().default(true),
})

const siteSchema = z.looseObject({
  name: text.min(1),
  title: text.min(1),
  url: url.refine((value) => !value.endsWith('/'), 'Leave off the trailing slash'),
  email: z.union([z.email(), z.literal('')]).default(''),
  resume: localPath.default(''),
  profileImage: z.union([localPath, imageObject]).default(''),
  links: z.looseObject({
    github: url,
    linkedin: url,
    upwork: url,
    other: z.array(z.strictObject({ label: text.min(1), url })).default([]),
  }),
  contact: z.looseObject({
    emailjs: z.strictObject({
      serviceId: optionalText,
      templateId: optionalText,
      publicKey: optionalText,
    }),
  }),
  seo: z.looseObject({ title: text.min(1), description: text.min(1) }),
})

function formatIssue(issue) {
  const path = issue.path.length ? issue.path.join('.') : '(root)'
  return `${path}: ${issue.message}`
}

function findHtml(value, path, found) {
  if (typeof value === 'string') {
    if (HTML_TAG.test(value)) found.push(`${path}: HTML is not allowed in content — use plain text`)
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => findHtml(item, `${path}[${index}]`, found))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => findHtml(item, path ? `${path}.${key}` : key, found))
  }
}

function validateList(entries, schema, file, report) {
  if (!Array.isArray(entries)) {
    report.errors.push({ file, message: 'Must contain a JSON array' })
    return []
  }

  const valid = []
  const seenIds = new Set()
  const seenSlugs = new Set()

  entries.forEach((entry, index) => {
    const label = `[${index}]${entry?.id ? ` "${entry.id}"` : ''}`
    const html = []
    findHtml(entry, '', html)
    const result = schema.safeParse(entry)
    const issues = [...html, ...(result.success ? [] : result.error.issues.map(formatIssue))]

    if (result.success) {
      const { id, slug: entrySlug } = result.data
      if (seenIds.has(id)) issues.push(`id: Duplicate id "${id}"`)
      if (entrySlug && seenSlugs.has(entrySlug)) issues.push(`slug: Duplicate slug "${entrySlug}"`)
      seenIds.add(id)
      if (entrySlug) seenSlugs.add(entrySlug)
    }

    if (issues.length) {
      issues.forEach((message) => report.errors.push({ file, entry: label, message }))
    } else {
      valid.push(result.data)
    }
  })

  return valid
}

/**
 * Validates every content file. Invalid entries are reported and left out of
 * `data`, so one broken project never takes the rest of the site down.
 */
export function validateContent({ site, projects, testimonials, experience }) {
  const report = { errors: [], warnings: [] }

  const siteResult = siteSchema.safeParse(site)
  const siteHtml = []
  findHtml(site, '', siteHtml)
  if (!siteResult.success) {
    siteResult.error.issues.forEach((issue) => report.errors.push({ file: 'site.json', message: formatIssue(issue) }))
  }
  siteHtml.forEach((message) => report.errors.push({ file: 'site.json', message }))

  const validProjects = validateList(projects, projectSchema, 'projects.json', report)
  const slugs = new Set(validProjects.map((project) => project.slug))
  const publishedSlugs = new Set(validProjects.filter((p) => p.published).map((p) => p.slug))

  for (const project of validProjects) {
    const entry = `"${project.id}"`
    if (project.featured && !project.published) {
      report.warnings.push({ file: 'projects.json', entry, message: 'Featured but not published — it stays hidden until "published" is true' })
    }
    if (project.published && !project.images.cover) {
      report.warnings.push({ file: 'projects.json', entry, message: 'Published without a cover image — a placeholder will be shown' })
    }
    for (const related of project.related) {
      if (!slugs.has(related)) {
        report.warnings.push({ file: 'projects.json', entry, message: `related: No project with slug "${related}"` })
      } else if (project.published && !publishedSlugs.has(related)) {
        report.warnings.push({ file: 'projects.json', entry, message: `related: "${related}" is not published and will be skipped` })
      }
    }
  }

  const validTestimonials = validateList(testimonials, testimonialSchema, 'testimonials.json', report)
  for (const testimonial of validTestimonials) {
    if (testimonial.projectSlug && !slugs.has(testimonial.projectSlug)) {
      report.warnings.push({ file: 'testimonials.json', entry: `"${testimonial.id}"`, message: `projectSlug: No project with slug "${testimonial.projectSlug}"` })
    }
  }

  const validExperience = validateList(experience, experienceSchema, 'experience.json', report)

  return {
    ...report,
    data: {
      site: siteResult.success ? siteResult.data : null,
      projects: validProjects,
      testimonials: validTestimonials,
      experience: validExperience,
    },
  }
}

export function formatReport({ errors, warnings }) {
  const line = ({ file, entry, message }) => `  ${file}${entry ? ` ${entry}` : ''} — ${message}`
  return [
    ...(errors.length ? [`${errors.length} error(s):`, ...errors.map(line)] : []),
    ...(warnings.length ? [`${warnings.length} warning(s):`, ...warnings.map(line)] : []),
  ].join('\n')
}
