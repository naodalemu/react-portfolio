import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowDown } from 'lucide-react'
import { site } from '../content'
import { gsap, SplitText, prefersReducedMotion } from '../motion/gsap'
import Magnetic from '../components/Magnetic'
import ImageTrail from '../components/ImageTrail'

export default function Hero() {
  const { hero } = site
  const root = useRef(null)
  const headline = useRef(null)
  // The bottom strip reads from the first three capability layers so it stays in sync with the content.
  const strata = site.capabilities.filter((group) => ['Interface', 'Application', 'Data'].includes(group.layer)).slice(0, 3)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    let split
    const ctx = gsap.context(() => {
      split = SplitText.create(headline.current.querySelectorAll('[data-line]'), { type: 'lines', mask: 'lines' })
      gsap
        .timeline({ delay: 0.15 })
        .from(split.lines, { yPercent: 110, stagger: 0.14, duration: 1.4 })
        .from('[data-hero-fade]', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1 }, '-=1')
        .from('[data-hero-strata] li', { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.9 }, '-=0.8')
    }, root)
    return () => {
      ctx.revert()
      split?.revert()
    }
  }, [])

  return (
    <section
      ref={root}
      data-theme="dark"
      aria-labelledby="hero-title"
      className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-16 text-paper"
    >
      <ImageTrail images={hero.trail ?? []} containerRef={root} />

      <div className="page-grid relative flex-1 content-center gap-y-10 py-14 md:py-20">
        <div className="col-span-full flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2" data-hero-fade>
          <p className="label text-paper">{hero.eyebrow}</p>
          <p className="label hidden [@media(pointer:fine)]:block">Move your cursor ↗</p>
        </div>

        <h1 id="hero-title" ref={headline} className="col-span-full text-display">
          <span data-line className="block pb-[0.06em] font-semibold [text-wrap:balance]">
            {hero.headlineLead}
          </span>
          <span data-line className="block pb-[0.12em] pl-[8%] font-serif font-normal italic tracking-[-0.03em] text-fog md:pl-[18%]">
            {hero.headlineFollow}
          </span>
        </h1>

        <div className="col-span-full grid gap-8 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8">
          <p className="text-lede text-fog" data-hero-fade>
            {hero.lede}
          </p>
          {/* Above the image trail (z-20) so the actions stay visible and clickable. */}
          <div className="relative z-30 flex flex-wrap items-center gap-x-8 gap-y-4" data-hero-fade>
            <Magnetic>
              <Link
                to="/#work"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-paper px-7 text-[0.95rem] font-medium text-ink transition-colors hover:bg-signal-bright"
              >
                See selected work
                <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5" />
              </Link>
            </Magnetic>
            <Link to="/#contact" className="link-underline text-[0.95rem] font-medium">
              Start a project
            </Link>
          </div>
        </div>
      </div>

      {strata.length > 0 && (
        <div className="page-grid relative z-10 pb-8">
          <ol data-hero-strata className="col-span-full grid border-t border-paper/15 sm:grid-cols-3" aria-label="What I work across">
            {strata.map((group, index) => (
              <li key={group.id} className="flex gap-4 border-paper/15 py-4 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0">
                <span className="label pt-0.5">0{index + 1}</span>
                <span>
                  <span className="block font-medium">{group.layer}</span>
                  <span className="block text-sm text-fog">{group.tools.slice(0, 4).join(', ')}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
