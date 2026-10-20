import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis = null
// Scroll position per history entry, so Back/Forward return to where you were.
const positions = new Map()

function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

/**
 * Smooth, eased page scroll (Lenis) driven by GSAP's ticker so ScrollTrigger
 * stays in sync, plus scroll handling for route changes.
 */
export function useSmoothScroll() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const currentKey = useRef(location.key)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const record = () => positions.set(currentKey.current, window.scrollY)
    window.addEventListener('scroll', record, { passive: true })

    const tick = (time) => lenis?.raf(time * 1000)
    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      document.documentElement.classList.add('lenis')
    }
    return () => {
      window.removeEventListener('scroll', record)
      if (lenis) {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenis = null
        document.documentElement.classList.remove('lenis')
      }
    }
  }, [])

  // Before paint: scroll events from here on belong to the new history entry.
  useLayoutEffect(() => {
    currentKey.current = location.key
  }, [location.key])

  // New pages start at the top, Back/Forward restore the saved position
  // (waiting for lazily loaded pages to become tall enough), hash links glide.
  useEffect(() => {
    let frame = 0
    let cancelled = false
    const saved = positions.get(location.key)

    frame = requestAnimationFrame(() => {
      lenis?.resize()
      const target = location.hash ? document.querySelector(location.hash) : null
      if (target) {
        if (lenis) lenis.scrollTo(target, { duration: 1.2 })
        else target.scrollIntoView()
      } else if (navigationType === 'POP' && saved) {
        const started = performance.now()
        const restore = () => {
          if (cancelled) return
          lenis?.resize()
          const reachable = document.documentElement.scrollHeight - window.innerHeight >= saved
          if (reachable || performance.now() - started > 1500) {
            scrollToY(saved)
            ScrollTrigger.refresh()
          } else {
            frame = requestAnimationFrame(restore)
          }
        }
        restore()
        return
      } else {
        scrollToY(0)
      }
      ScrollTrigger.refresh()
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [location.key, location.hash, navigationType])
}
