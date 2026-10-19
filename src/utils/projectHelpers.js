// Pure helpers for working with project content. Components never filter or
// sort projects themselves; they go through these functions.

export const LAYERS = [
  { id: 'interface', label: 'Interface' },
  { id: 'application', label: 'Application' },
  { id: 'data', label: 'Data' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'tooling', label: 'Tooling' },
]

// Known technologies and the layer of the stack they belong to. Anything not
// listed falls under "Tooling" unless the project sets `layer` explicitly.
const TECH_LAYERS = {
  interface: [
    'react', 'next.js', 'vue', 'nuxt', 'alpine.js', 'javascript', 'typescript', 'html', 'css', 'sass',
    'tailwind css', 'bootstrap', 'material ui', 'shadcn/ui', 'inertia.js', 'jquery', 'chart.js', 'blade',
  ],
  application: [
    'php', 'laravel', 'livewire', 'filament', 'node.js', 'express', 'rest apis', 'rest api', 'graphql',
    'python', 'django', 'stripe', 'paypal', 'websockets', 'queues', 'emailjs',
  ],
  data: ['mysql', 'postgresql', 'sqlite', 'mariadb', 'redis', 'mongodb', 'firebase', 'supabase', 'elasticsearch', 'meilisearch'],
  infrastructure: [
    'vercel', 'netlify', 'aws', 'docker', 'nginx', 'apache', 'digitalocean', 'laravel forge', 'github actions',
    'linux', 'cloudflare', 'cpanel', 'hetzner',
  ],
}

const LAYER_BY_TECH = Object.fromEntries(
  Object.entries(TECH_LAYERS).flatMap(([layer, names]) => names.map((name) => [name, layer])),
)

export function normalizeTech(item) {
  const name = typeof item === 'string' ? item : item.name
  const layer = (typeof item === 'object' && item.layer) || LAYER_BY_TECH[name.toLowerCase()] || 'tooling'
  return { name, layer }
}

/** Groups a project's stack by layer, in stack order, omitting empty layers. */
export function groupStackByLayer(techStack = []) {
  const items = techStack.map(normalizeTech)
  return LAYERS.map((layer) => ({ ...layer, items: items.filter((item) => item.layer === layer.id) })).filter(
    (group) => group.items.length,
  )
}

/** The layers (excluding tooling) a project touches — drives the strata marks. */
export function layersTouched(techStack = []) {
  const touched = new Set(techStack.map((item) => normalizeTech(item).layer))
  return LAYERS.filter((layer) => layer.id !== 'tooling').map((layer) => ({ ...layer, active: touched.has(layer.id) }))
}

const byOrder = (a, b) =>
  a.sortOrder - b.sortOrder || String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title)

export function getPublishedProjects(projects) {
  return projects.filter((project) => !project.draft).sort(byOrder)
}

export function getFeaturedProjects(projects) {
  return getPublishedProjects(projects).filter((project) => project.featured)
}

/** Drafts exist only in development builds, where they can be previewed. */
export function getProjectBySlug(projects, slug) {
  return projects.find((project) => project.slug === slug) ?? null
}

export function getAdjacentProjects(projects, slug) {
  const list = getPublishedProjects(projects)
  const index = list.findIndex((project) => project.slug === slug)
  if (list.length === 0 || (index !== -1 && list.length < 2)) return { previous: null, next: null }
  if (index === -1) return { previous: null, next: list[0] }
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  }
}

export function getRelatedProjects(projects, project) {
  const published = getPublishedProjects(projects)
  return project.related.map((slug) => published.find((item) => item.slug === slug)).filter(Boolean)
}

export function clientLabel(project) {
  const { name, descriptor, disclose } = project.client
  return disclose && name ? name : descriptor
}

export function projectLinks(project) {
  const { links, visibility } = project
  return [
    visibility.showLiveLink && links.live && { label: 'Visit live site', href: links.live },
    visibility.showGithubLink && links.github && { label: 'View source', href: links.github },
    links.caseStudy && { label: 'Extended case study', href: links.caseStudy },
    links.figma && { label: 'Design file', href: links.figma },
  ].filter(Boolean)
}

/** The single outcome shown on a preview: the first metric, when metrics are visible. */
export function headlineMetric(project) {
  return project.visibility.showMetrics ? (project.metrics[0] ?? null) : null
}

export function paragraphs(text = '') {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function previewImage(project) {
  return project.images.thumbnail || project.images.cover
}

export const coverTransitionName = (project) => `cover-${project.slug}`

export function hasGallery(project) {
  if (!project.visibility.showGallery) return false
  const { images } = project
  const screenshots = [...images.desktop, ...images.mobile, ...images.gallery]
  return screenshots.some((image) => !image.missing) || images.beforeAfter.length > 0 || Boolean(images.video)
}
