import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import content from './plugins/content.js'

// Alternative content sets, selected with --mode (works in every shell):
//   npm run dev:demo      demo/      — fake projects to preview the design
//   npm run dev:fixtures  fixtures/  — test content for edge cases
// Their data files override src/data file by file; production builds use src/data only.
const CONTENT_SETS = ['demo', 'fixtures']

export default defineConfig(({ mode }) => {
  const contentSet = CONTENT_SETS.includes(mode) ? mode : ''
  const dataDirs = [contentSet && path.resolve(contentSet, 'data'), path.resolve('src/data')].filter(Boolean)
  const publicDir = path.resolve(contentSet ? `${contentSet}/public` : 'public')

  return {
    publicDir,
    plugins: [react(), content({ dataDirs, publicDir, contentSet })],
    build: {
      target: 'es2022',
      // Fonts and icons are small; inlining them would only bloat the CSS.
      assetsInlineLimit: 0,
      rolldownOptions: {
        output: {
          // Separate, long-cached chunks: the app's own code changes far more often than these.
          advancedChunks: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/ },
              { name: 'motion', test: /node_modules[\\/](gsap|lenis)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
