// npm run validate — checks src/data/*.json and every referenced file.
// Exits with code 1 if anything would break or be hidden on the site.

import fs from 'node:fs'
import path from 'node:path'
import { loadContent } from '../plugins/content.js'
import { formatReport } from '../src/utils/contentValidation.js'

// `npm run validate -- demo` (or fixtures) checks an alternative content set.
const contentSet = ['demo', 'fixtures'].includes(process.argv[2]) ? process.argv[2] : ''
const dataDirs = [contentSet && path.resolve(contentSet, 'data'), path.resolve('src/data')].filter(Boolean)
const publicDir = path.resolve(contentSet ? `${contentSet}/public` : 'public')

let report
try {
  report = loadContent(dataDirs)
} catch (error) {
  console.error(`✖ ${error.message}`)
  process.exit(1)
}

// File checks for published projects: missing files would show placeholders on the live site.
const collect = (value) => (Array.isArray(value) ? value : value ? [value] : []).map((item) => (typeof item === 'string' ? item : item.src))
for (const project of report.data.projects.filter((item) => item.published)) {
  const { images } = project
  const paths = [
    ...collect(images.cover),
    ...collect(images.thumbnail),
    ...collect(images.desktop),
    ...collect(images.mobile),
    ...collect(images.gallery),
    ...images.beforeAfter.flatMap((pair) => [...collect(pair.before), ...collect(pair.after)]),
    images.video?.src,
    images.video?.poster,
  ].filter(Boolean)

  for (const src of paths) {
    if (!fs.existsSync(path.join(publicDir, src))) {
      report.errors.push({ file: 'projects.json', entry: `"${project.id}"`, message: `File not found: public${src}` })
    }
  }
}

const { site } = report.data
if (site?.resume && !fs.existsSync(path.join(publicDir, site.resume))) {
  report.errors.push({ file: 'site.json', message: `resume: File not found: public${site.resume}` })
}

const output = formatReport(report)
const published = report.data.projects.filter((project) => project.published)
const featured = published.filter((project) => project.featured)

if (output) console.log(output + '\n')
console.log(
  `${report.data.projects.length} project(s): ${published.length} published, ${featured.length} featured, ` +
    `${report.data.projects.length - published.length} draft.`,
)

if (report.errors.length) {
  console.error('\n✖ Content has errors. Fix them before deploying.')
  process.exit(1)
}
console.log('✔ Content is valid.')
