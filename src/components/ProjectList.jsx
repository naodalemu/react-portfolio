import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { previewImage } from '../utils/projectHelpers'
import { gsap, hasFinePointer, prefersReducedMotion } from '../motion/gsap'

/**
 * Projects as a large-type list on a dark background. On mouse devices a
 * preview of the hovered project's cover follows the cursor.
 */
export default function ProjectList({ projects: list, numbered = true }) {
  const preview = useRef(null)
  const area = useRef(null)
  const [active, setActive] = useState(null)
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())

  useLayoutEffect(() => {
    if (!enabled) return
    const el = preview.current
    const zone = area.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const onMove = (event) => {
      const rect = zone.getBoundingClientRect()
      xTo(event.clientX - rect.left)
      yTo(event.clientY - rect.top)
    }
    zone.addEventListener('pointermove', onMove)
    return () => zone.removeEventListener('pointermove', onMove)
  }, [enabled])

  const activeImage = active ? previewImage(active) : null

  return (
    <div ref={area} className="relative" onPointerLeave={() => setActive(null)}>
      <ol className="border-t border-paper/15">
        {list.map((project, index) => (
          <li key={project.id} className="border-b border-paper/15">
            <Link
              to={`/work/${project.slug}`}
              viewTransition
              onPointerEnter={() => setActive(project)}
              onFocus={() => setActive(project)}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-7 md:grid-cols-[3rem_minmax(0,1fr)_14rem_6rem_auto]"
            >
              {numbered && <span className="label hidden tabular-nums md:block">{String(index + 1).padStart(2, '0')}</span>}
              <span className={`text-[clamp(1.6rem,1.1rem+2vw,3.5rem)] font-semibold tracking-[-0.03em] transition duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-signal-bright ${numbered ? '' : 'md:col-span-2'}`}>
                {project.title}
              </span>
              <span className="label hidden md:block">{project.category}</span>
              <span className="label hidden tabular-nums md:block">{project.year}</span>
              <ArrowUpRight aria-hidden="true" className="h-6 w-6 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ol>

      {enabled && (
        <div ref={preview} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block">
          <div
            className={`-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md shadow-2xl transition-[opacity,transform] duration-500 ease-out-expo ${
              activeImage ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{ width: '24rem', aspectRatio: '16 / 10' }}
          >
            {activeImage && !activeImage.missing && (
              <img src={activeImage.srcSet ? activeImage.srcSet.split(' ')[0] : activeImage.src} alt="" className="h-full w-full object-cover object-top" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
