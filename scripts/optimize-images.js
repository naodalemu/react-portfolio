// npm run images — converts original screenshots into web-ready WebP files.
//
//   assets-src/projects/<slug>/<name>.png|jpg|jpeg|webp
//     → public/projects/<slug>/<name>.webp        (max 2400px wide)
//     → public/projects/<slug>/<name>-960w.webp   (for phones, when the original is wider)
//
// Quality stays high on purpose: UI text in screenshots must remain readable.
// Existing outputs are skipped unless the source is newer; pass --force to redo all.

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = path.resolve('assets-src/projects')
const TARGET = path.resolve('public/projects')
const FULL_WIDTH = 2400
const SMALL_WIDTH = 960
const QUALITY = 86
const force = process.argv.includes('--force')

if (!fs.existsSync(SOURCE)) {
  console.log('Nothing to do: put original screenshots in assets-src/projects/<project-slug>/ first.')
  process.exit(0)
}

const isImage = (file) => /\.(png|jpe?g|webp)$/i.test(file)
const isStale = (source, output) => force || !fs.existsSync(output) || fs.statSync(output).mtimeMs < fs.statSync(source).mtimeMs

let converted = 0
for (const slug of fs.readdirSync(SOURCE)) {
  const sourceDir = path.join(SOURCE, slug)
  if (!fs.statSync(sourceDir).isDirectory()) continue
  const targetDir = path.join(TARGET, slug)
  fs.mkdirSync(targetDir, { recursive: true })

  for (const file of fs.readdirSync(sourceDir).filter(isImage)) {
    const source = path.join(sourceDir, file)
    const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    const full = path.join(targetDir, `${name}.webp`)
    const small = path.join(targetDir, `${name}-${SMALL_WIDTH}w.webp`)
    if (!isStale(source, full)) continue

    const { width } = await sharp(source).metadata()
    await sharp(source)
      .resize({ width: Math.min(width, FULL_WIDTH), withoutEnlargement: true })
      .webp({ quality: QUALITY, smartSubsample: true })
      .toFile(full)

    if (width > SMALL_WIDTH) {
      await sharp(source).resize({ width: SMALL_WIDTH }).webp({ quality: QUALITY, smartSubsample: true }).toFile(small)
    } else if (fs.existsSync(small)) {
      fs.rmSync(small)
    }

    const kb = (fs.statSync(full).size / 1024).toFixed(0)
    console.log(`  ${slug}/${name}.webp  ${Math.min(width, FULL_WIDTH)}px  ${kb} KB`)
    converted++
  }
}

console.log(converted ? `✔ Optimized ${converted} image(s).` : 'All images are up to date.')
