// Copies the brand marks the site uses from Simple Icons (CC0) into
// src/data/tech-icons.json, so the 3,000-icon package never ships to visitors.
// Run after adding a tool: node scripts/extract-icons.js
import fs from 'node:fs'
import * as icons from 'simple-icons'

const WANTED = {
  react: 'siReact', 'next.js': 'siNextdotjs', typescript: 'siTypescript', javascript: 'siJavascript',
  'alpine.js': 'siAlpinedotjs', 'tailwind css': 'siTailwindcss', bootstrap: 'siBootstrap', 'material ui': 'siMui',
  'shadcn/ui': 'siShadcnui', vite: 'siVite', html: 'siHtml5', css: 'siCss', php: 'siPhp', laravel: 'siLaravel',
  livewire: 'siLivewire', filament: 'siFilament', mysql: 'siMysql', redis: 'siRedis', 'redis / valkey': 'siRedis',
  docker: 'siDocker', vercel: 'siVercel', git: 'siGit', github: 'siGithub', gitlab: 'siGitlab', vitest: 'siVitest', figma: 'siFigma',
}

const out = {}
for (const [name, key] of Object.entries(WANTED)) {
  const icon = icons[key]
  if (!icon) throw new Error(`Simple Icons has no ${key}`)
  out[name] = { path: icon.path, hex: icon.hex }
}
fs.writeFileSync('src/data/tech-icons.json', JSON.stringify(out, null, 2) + '\n')
console.log(`Wrote ${Object.keys(out).length} icons to src/data/tech-icons.json`)
