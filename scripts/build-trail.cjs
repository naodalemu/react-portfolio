// Hero image trail: resizes full-section captures in assets-src/trail/*.png
// to uniform 16:10 WebP tiles in public/trail/ and records them in site.json.
// Run: node scripts/build-trail.cjs
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const SRC = 'assets-src/trail'
const OUT = 'public/trail'

;(async () => {
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })
  const groups = {}
  for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.png')).sort()) {
    const name = path.basename(file, '.png')
    await sharp(path.join(SRC, file)).resize({ width: 640, height: 400, fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}.webp`))
    const project = name.split('-')[0]
    ;(groups[project] ??= []).push({ src: `/trail/${name}.webp`, width: 640, height: 400 })
  }
  // Interleave projects so consecutive trail images vary.
  const lists = Object.values(groups)
  const mixed = []
  for (let i = 0; mixed.length < lists.flat().length; i++) for (const list of lists) if (list[i]) mixed.push(list[i])
  const siteFile = 'src/data/site.json'
  const site = JSON.parse(fs.readFileSync(siteFile, 'utf8'))
  site.hero.trail = mixed
  fs.writeFileSync(siteFile, JSON.stringify(site, null, 2) + '\n')
  console.log(`Wrote ${mixed.length} trail tiles`)
})()
