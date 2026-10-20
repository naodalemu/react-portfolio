import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion } from '../motion/gsap'

/**
 * Reveals a heading line by line (or char by char) as it scrolls into view.
 * Text stays fully readable without JavaScript or with reduced motion.
 */
export function useSplitReveal({ type = 'lines', stagger = 0.08, delay = 0, onLoad = false } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let split
    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: type === 'chars' ? 'chars,lines' : 'lines', mask: 'lines', autoSplit: true })
      const targets = type === 'chars' ? split.chars : split.lines
      gsap.from(targets, {
        yPercent: 110,
        stagger,
        delay,
        duration: 1.2,
        ...(onLoad ? {} : { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }),
      })
    })
    return () => {
      ctx.revert()
      split?.revert()
    }
  }, [type, stagger, delay, onLoad])

  return ref
}
