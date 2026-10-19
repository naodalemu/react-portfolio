// One place to register GSAP plugins. Import gsap from here, never from 'gsap' directly.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.defaults({ ease: 'expo.out', duration: 1.1 })

/** True when the visitor asked for reduced motion; every effect checks this first. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fine pointer = mouse or trackpad; cursor and hover effects are skipped on touch. */
export const hasFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export { gsap, ScrollTrigger, SplitText }
