import { useEffect, useRef } from 'react'

let observer = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-revealed', '')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  return observer
}

/** Marks an element as revealed the first time it scrolls into view. Styling lives in index.css. */
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const io = getObserver()
    if (!io) {
      element.setAttribute('data-revealed', '')
      return
    }
    io.observe(element)
    return () => io.unobserve(element)
  }, [])

  return ref
}
