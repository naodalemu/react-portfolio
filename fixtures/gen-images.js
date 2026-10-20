// Generates flat, clearly labelled test images for the fixture project.
import sharp from 'sharp'
const dir = 'fixtures/public/projects/fixture-full'
const svg = (w, h, label, bg) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <rect x="${w*0.06}" y="${h*0.08}" width="${w*0.88}" height="${h*0.06}" fill="#ffffff" opacity="0.6"/>
  <rect x="${w*0.06}" y="${h*0.22}" width="${w*0.5}" height="${h*0.3}" fill="#ffffff" opacity="0.35"/>
  <rect x="${w*0.6}" y="${h*0.22}" width="${w*0.34}" height="${h*0.3}" fill="#000000" opacity="0.15"/>
  <text x="50%" y="75%" font-family="Arial" font-size="${Math.round(w/18)}" text-anchor="middle" fill="#151513">FIXTURE — ${label}</text>
</svg>`)
const out = async (name, w, h, label, bg) => {
  await sharp(svg(w, h, label, bg)).webp({ quality: 80 }).toFile(`${dir}/${name}.webp`)
}
await out('cover', 2400, 1500, 'cover', '#B9C4BC')
await out('cover-960w', 960, 600, 'cover 960w', '#B9C4BC')
await out('desktop-01', 2400, 1500, 'desktop', '#CFC6B4')
await out('mobile-01', 780, 1688, 'mobile 1', '#C7CDD6')
await out('mobile-02', 780, 1688, 'mobile 2', '#D6C7C7')
await out('detail-01', 1200, 900, 'detail', '#D2D6C7')
await out('before-01', 2000, 1250, 'before', '#D9B8A8')
await out('after-01', 2000, 1250, 'after', '#A8D9B8')
console.log('fixture images written')
