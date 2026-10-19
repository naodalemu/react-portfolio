import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import { contentSet } from '../content'
import Cursor from '../components/Cursor'
import { useSmoothScroll } from '../motion/useSmoothScroll'

export default function SiteLayout() {
  useSmoothScroll()
  return (
    <>
      <span id="top" />
      <a
        href="#main"
        className="fixed left-4 top-4 z-50 -translate-y-24 bg-ink px-4 py-3 text-sm text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      {contentSet && (
        <p role="note" className="pointer-events-none fixed bottom-4 left-4 z-50 bg-signal px-3 py-1.5 font-mono text-label uppercase text-paper">
          {contentSet} content · not real projects
        </p>
      )}
      <Cursor />
    </>
  )
}
