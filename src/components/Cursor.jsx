import { useEffect, useRef, useState } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '../motion/gsap'

/**
 * A small follower that grows into a labelled disc over elements with
 * data-cursor="Label". Mouse/trackpad only; the native cursor stays visible.
 */
export default function Cursor() {
  const ref = useRef(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const onMove = (event) => {
      xTo(event.clientX)
      yTo(event.clientY)
      const target = event.target.closest?.('[data-cursor]')
      setLabel(target ? target.getAttribute('data-cursor') : '')
    }
    const onLeave = () => setLabel('')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal font-mono text-[0.7rem] uppercase tracking-wider text-paper transition-[width,height,opacity] duration-500 ease-out-expo ${
          label ? 'h-24 w-24 opacity-100' : 'h-0 w-0 opacity-0'
        }`}
      >
        <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
      </div>
    </div>
  )
}
