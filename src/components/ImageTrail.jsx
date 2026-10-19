import { useEffect, useRef, useState } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '../motion/gsap'

const POOL = 12 // image elements recycled for the trail
const SPACING = 110 // px of pointer travel between images

/**
 * Pointer-driven image trail: moving across the container drops a stream of
 * small images that pop in and fall away. Touch devices get a slow automatic
 * trail instead; reduced-motion visitors get nothing.
 */
export default function ImageTrail({ images, containerRef }) {
  const layer = useRef(null)
  const [ready, setReady] = useState(false)
  const [enabled] = useState(() => !prefersReducedMotion() && images.length > 0)

  // Preload after the page has settled so the trail never competes with first paint.
  useEffect(() => {
    if (!enabled) return
    const start = () => {
      let loaded = 0
      images.forEach((image) => {
        const img = new Image()
        img.onload = img.onerror = () => {
          loaded += 1
          if (loaded === images.length) setReady(true)
        }
        img.src = image.src
      })
    }
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 600))
    const id = idle(start)
    return () => (window.cancelIdleCallback ?? clearTimeout)(id)
  }, [enabled, images])

  useEffect(() => {
    if (!enabled || !ready) return
    const zone = containerRef.current
    const nodes = [...layer.current.children]
    let index = 0
    let z = 1
    let last = null

    const drop = (x, y, dx = 0, dy = 0) => {
      const node = nodes[index % nodes.length]
      const image = images[index % images.length]
      index += 1
      node.src = image.src
      node.style.zIndex = String((z += 1))
      gsap.killTweensOf(node)
      gsap
        .timeline()
        .set(node, { x, y, xPercent: -50, yPercent: -50, scale: 0.4, opacity: 1, rotation: 0 })
        .to(node, { scale: 1, x: x + dx * 0.5, y: y + dy * 0.5, duration: 0.45, ease: 'power3.out' })
        .to(node, { y: `+=${180 + Math.random() * 120}`, rotation: gsap.utils.random(-14, 14), scale: 0.7, opacity: 0, duration: 0.9, ease: 'power2.in' }, '+=0.15')
    }

    if (hasFinePointer()) {
      const onMove = (event) => {
        const rect = zone.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        if (!last) last = { x, y }
        const dx = x - last.x
        const dy = y - last.y
        if (Math.hypot(dx, dy) < SPACING) return
        drop(x, y, dx, dy)
        last = { x, y }
      }
      const onLeave = () => (last = null)
      zone.addEventListener('pointermove', onMove)
      zone.addEventListener('pointerleave', onLeave)
      return () => {
        zone.removeEventListener('pointermove', onMove)
        zone.removeEventListener('pointerleave', onLeave)
        gsap.killTweensOf(nodes)
      }
    }

    // Touch: a gentle automatic trail while the hero is on screen.
    let timer
    let visible = true
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    observer.observe(zone)
    const tick = () => {
      if (visible && document.visibilityState === 'visible') {
        const rect = zone.getBoundingClientRect()
        drop(rect.width * (0.15 + Math.random() * 0.7), rect.height * (0.15 + Math.random() * 0.45))
      }
      timer = setTimeout(tick, 900)
    }
    tick()
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      gsap.killTweensOf(nodes)
    }
  }, [enabled, ready, images, containerRef])

  if (!enabled) return null
  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none absolute inset-0 isolate z-20 overflow-hidden">
      {Array.from({ length: POOL }, (_, i) => (
        <img
          key={i}
          alt=""
          decoding="async"
          className="absolute left-0 top-0 aspect-[16/10] w-[clamp(11rem,16vw,17rem)] rounded-md object-cover opacity-0 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)] will-change-transform"
        />
      ))}
    </div>
  )
}
