// Vite plugin that turns src/data/*.json into the site's content.
//
// - Exposes validated content as `virtual:portfolio-content`.
// - Adds image dimensions (and the -960w variant, if present) so images
//   reserve their space and never shift the layout.
// - Strips unpublished projects from production builds entirely.
// - Writes per-route HTML (metadata for each case study), 404.html,
//   sitemap.xml and robots.txt into dist/.

import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import { validateContent, formatReport } from '../src/utils/contentValidation.js'

const VIRTUAL_ID = 'virtual:portfolio-content'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const FILES = ['site', 'projects', 'testimonials', 'experience']
const HEAD_START = '<!--head:start-->'
const HEAD_END = '<!--head:end-->'
const PRELOAD_FONTS = [/^instrument-sans-latin-wght-normal-[\w-]+\.woff2$/, /^instrument-serif-latin-400-italic-[\w-]+\.woff2$/]

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Invalid JSON in ${path.basename(file)}: ${error.message}`, { cause: error })
  }
}

/** Path of a content file, looking through `dataDirs` in order (an overlay, then src/data). */
export function contentFile(dataDirs, name) {
  return dataDirs.map((dir) => path.join(dir, `${name}.json`)).find((file) => fs.existsSync(file))
}

export function loadContent(dataDirs) {
  const raw = Object.fromEntries(
    FILES.map((name) => {
      const file = contentFile(dataDirs, name)
      return [name, file ? readJson(file) : name === 'site' ? {} : []]
    }),
  )
  return validateContent(raw)
}

function variantPath(src, width) {
  return src.replace(/(\.[a-z0-9]+)$/i, `-${width}w$1`)
}

function resolveImage(value, publicDir, onMissing) {
  if (!value) return null
  const image = typeof value === 'string' ? { src: value, alt: '', caption: '', frame: 'auto' } : { ...value }
  const file = path.join(publicDir, decodeURI(image.src))

  if (!fs.existsSync(file)) {
    onMissing(image.src)
    return { ...image, missing: true }
  }

  try {
    const { width, height } = imageSize(fs.readFileSync(file))
    const small = variantPath(image.src, 960)
    const hasSmall = width > 960 && fs.existsSync(path.join(publicDir, decodeURI(small)))
    return { ...image, width, height, srcSet: hasSmall ? `${small} 960w, ${image.src} ${width}w` : '' }
  } catch {
    // Unreadable or unsupported format: render it without reserved dimensions.
    return image
  }
}

const asList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

function resolveProjectImages(project, publicDir, warn) {
  const onMissing = (src) => {
    if (project.published) warn(`projects.json "${project.id}" — image not found: public${src}`)
  }
  const one = (value) => resolveImage(value, publicDir, onMissing)
  const many = (value) => asList(value).map(one).filter(Boolean)
  const { images } = project

  const video = images.video?.src
    ? fs.existsSync(path.join(publicDir, images.video.src))
      ? { ...images.video, poster: images.video.poster ? one(images.video.poster)?.src ?? '' : '' }
      : (onMissing(images.video.src), null)
    : null

  return {
    ...project,
    images: {
      cover: one(images.cover),
      thumbnail: one(images.thumbnail),
      desktop: many(images.desktop),
      mobile: many(images.mobile),
      gallery: many(images.gallery),
      beforeAfter: images.beforeAfter.map((pair) => ({ ...pair, before: one(pair.before), after: one(pair.after) })),
      video,
    },
  }
}

// ---------------------------------------------------------------------------
// Head metadata

const escape = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

function absolute(site, pathname) {
  return site.url ? `${site.url}${pathname}` : ''
}

function personLd(site) {
  const sameAs = [site.links.github, site.links.linkedin, site.links.upwork, ...site.links.other.map((link) => link.url)].filter(Boolean)
  return {
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title,
    ...(site.url && { url: site.url }),
    ...(sameAs.length && { sameAs }),
    knowsAbout: (site.capabilities ?? []).map((group) => group.title),
  }
}

export function buildHead(site, page = {}) {
  const title = page.title ?? site.seo.title
  const description = page.description ?? site.seo.description
  const url = absolute(site, page.path ?? '/')
  const image = page.image ?? site.seo.ogImage
  const imageUrl = image && site.url ? absolute(site, image) : ''
  const tags = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    page.noindex && '<meta name="robots" content="noindex" />',
    url && `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:type" content="${page.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${escape(site.name)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    url && `<meta property="og:url" content="${escape(url)}" />`,
    imageUrl && `<meta property="og:image" content="${escape(imageUrl)}" />`,
    `<meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}" />`,
    site.seo.twitterHandle && `<meta name="twitter:site" content="${escape(site.seo.twitterHandle)}" />`,
    page.ld && jsonLd(page.ld),
  ]
  return [HEAD_START, ...tags.filter(Boolean), HEAD_END].join('\n    ')
}

function homeLd(site) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: site.name, ...(site.url && { url: site.url }) },
      personLd(site),
    ],
  }
}

function projectPage(site, project) {
  const pathname = `/work/${project.slug}`
  const cover = project.images.cover && !project.images.cover.missing ? project.images.cover.src : undefined
  return {
    path: pathname,
    type: 'article',
    title: `${project.title} | ${site.name}`,
    description: project.subtitle || project.description,
    image: cover,
    ld: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      ...(project.year && { dateCreated: project.year }),
      ...(site.url && { url: absolute(site, pathname) }),
      ...(cover && site.url && { image: absolute(site, cover) }),
      ...(project.techStack.length && {
        keywords: project.techStack.map((item) => (typeof item === 'string' ? item : item.name)).join(', '),
      }),
      creator: { '@type': 'Person', name: site.name, ...(site.url && { url: site.url }) },
    },
  }
}

function replaceHead(html, head) {
  const start = html.indexOf(HEAD_START)
  const end = html.indexOf(HEAD_END) + HEAD_END.length
  return html.slice(0, start) + head + html.slice(end)
}

// ---------------------------------------------------------------------------

export default function contentPlugin({ dataDirs, publicDir, contentSet = '' }) {
  let isBuild = false
  let outDir = 'dist'
  let current = null
  let logger = console

  function load() {
    const report = loadContent(dataDirs)
    const problems = formatReport(report)

    if (report.errors.length && isBuild) {
      throw new Error(`Content validation failed.\n${problems}\n\nRun "npm run validate" for details.`)
    }
    if (problems) logger.warn(`\n[content]\n${problems}\n`)
    if (!report.data.site) throw new Error(`site.json is invalid.\n${problems}`)

    const warnings = []
    const warn = (message) => warnings.push(message)
    const { site } = report.data

    // Drafts are visible in `npm run dev` only, behind a banner. Production
    // builds never contain them.
    const projects = report.data.projects
      .filter((project) => project.published || !isBuild)
      .map((project) => ({ ...resolveProjectImages(project, publicDir, warn), draft: !project.published }))

    const fileExists = (src) => src && fs.existsSync(path.join(publicDir, src))
    if (site.resume && !fileExists(site.resume)) warn(`site.json — resume not found: public${site.resume}`)

    const content = {
      contentSet,
      site: {
        ...site,
        resume: fileExists(site.resume) ? site.resume : '',
        profileImage: site.profileImage ? resolveImage(site.profileImage, publicDir, (src) => warn(`site.json — profile image not found: public${src}`)) : null,
      },
      projects,
      testimonials: report.data.testimonials.filter((item) => item.published),
      experience: report.data.experience.filter((item) => item.published),
    }

    if (warnings.length) logger.warn(`[content]\n  ${warnings.join('\n  ')}\n`)
    current = { content, allProjects: report.data.projects }
    return current
  }

  return {
    name: 'portfolio-content',

    configResolved(config) {
      isBuild = config.command === 'build'
      outDir = path.resolve(config.root, config.build.outDir)
      logger = config.logger
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return
      FILES.forEach((name) => {
        const file = contentFile(dataDirs, name)
        if (file) this.addWatchFile(file)
      })
      const { content } = load()
      return `export default ${JSON.stringify(content)}`
    },

    transformIndexHtml(html) {
      const { site } = (current ?? load()).content
      return html.replace('<!--app-head-->', buildHead(site, { ld: homeLd(site) }))
    },

    hotUpdate({ file }) {
      if (this.environment.name !== 'client') return
      const isData = dataDirs.some((dir) => path.dirname(file) === path.resolve(dir)) && file.endsWith('.json')
      const isImage = file.startsWith(path.resolve(publicDir, 'projects'))
      if (!isData && !isImage) return
      const module = this.environment.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) this.environment.moduleGraph.invalidateModule(module)
      current = null
      this.environment.hot.send({ type: 'full-reload' })
      return []
    },

    closeBundle() {
      if (!isBuild || !current) return
      const { content, allProjects } = current
      const { site } = content
      // Preload the two fonts visible above the fold so text doesn't reflow when they arrive.
      const fonts = fs.readdirSync(path.join(outDir, 'assets')).filter((name) => PRELOAD_FONTS.some((pattern) => pattern.test(name)))
      const preloads = fonts.map((name) => `<link rel="preload" href="/assets/${name}" as="font" type="font/woff2" crossorigin />`)
      const indexHtml = fs
        .readFileSync(path.join(outDir, 'index.html'), 'utf8')
        .replace('</head>', `  ${preloads.join('\n    ')}\n  </head>`)
      fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml)

      // One HTML file per published case study, so direct visits and refreshes
      // are served as real files with the right metadata.
      for (const project of content.projects) {
        const dir = path.join(outDir, 'work', project.slug)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), replaceHead(indexHtml, buildHead(site, projectPage(site, project))))
      }

      // The full project list at /work.
      fs.mkdirSync(path.join(outDir, 'work'), { recursive: true })
      fs.writeFileSync(
        path.join(outDir, 'work', 'index.html'),
        replaceHead(indexHtml, buildHead(site, { path: '/work', title: `Work | ${site.name}`, description: `Every published project by ${site.name}: case studies in SaaS, e-commerce, APIs and tools.` })),
      )

      fs.writeFileSync(
        path.join(outDir, '404.html'),
        replaceHead(indexHtml, buildHead(site, { title: `Page not found | ${site.name}`, description: site.seo.description, noindex: true })),
      )

      // Unpublished projects must not be reachable through their asset folders either.
      const publishedPaths = JSON.stringify(content.projects.map((project) => project.images))
      for (const project of allProjects.filter((item) => !item.published)) {
        const folder = `/projects/${project.slug}/`
        if (!publishedPaths.includes(folder)) {
          fs.rmSync(path.join(outDir, 'projects', project.slug), { recursive: true, force: true })
        }
      }

      const robots = ['User-agent: *', 'Allow: /']
      if (site.url) {
        const today = new Date().toISOString().slice(0, 10)
        const urls = ['/', '/work', ...content.projects.map((project) => `/work/${project.slug}`)]
        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map((url) => `  <url><loc>${escape(site.url + url)}</loc><lastmod>${today}</lastmod></url>`),
          '</urlset>',
          '',
        ].join('\n')
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
        robots.push(`Sitemap: ${site.url}/sitemap.xml`)
      } else {
        logger.warn('[content] site.json "url" is empty — canonical URLs, og:image and sitemap.xml were skipped.')
      }
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robots.join('\n') + '\n')
    },
  }
}
