import { useId, useState } from 'react'
import { Star } from 'lucide-react'
import { site, testimonials } from '../content'
import SectionHeading from '../components/SectionHeading'
import ExternalLink from '../components/ExternalLink'
import Reveal from '../components/Reveal'

// The first entry in testimonials.json is featured; the next few are listed;
// the rest stay behind "Show all".
const LISTED = 4

function Stars({ value = 5, className = '' }) {
  return (
    <span className={`flex items-center gap-1 text-signal ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < value ? 'fill-current' : 'opacity-30'}`} />
      ))}
    </span>
  )
}

function caption(item) {
  const who = item.anonymized ? '' : [item.name, item.role].filter(Boolean).join(', ')
  return [who, item.organization, item.date].filter(Boolean).join('  ·  ')
}

function Quote({ item }) {
  return (
    <figure className="border-t border-ink/15 py-6">
      <blockquote className="text-lg leading-relaxed text-ink">
        <p>“{item.quote}”</p>
      </blockquote>
      <figcaption className="label mt-3">{caption(item)}</figcaption>
    </figure>
  )
}

/** Rendered only when testimonials.json contains published entries. */
export default function Testimonials() {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  if (!testimonials.length) return null

  const [featured, ...others] = testimonials
  const listed = others.slice(0, LISTED)
  const extra = others.slice(LISTED)
  const rated = testimonials.filter((item) => item.rating)
  const average = rated.length ? rated.reduce((sum, item) => sum + item.rating, 0) / rated.length : 0
  const fromUpwork = testimonials.every((item) => item.role === 'Upwork client')
  const credentials = (site.credentials?.items ?? []).filter((item) => /upwork/i.test(item.label))

  return (
    <section aria-labelledby="testimonials-title" className="pb-section">
      <SectionHeading index="05" id="testimonials-title">
        Client words
      </SectionHeading>

      <div className="page-grid mt-12 gap-y-12 md:mt-16">
        <Reveal className="col-span-full lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          {average > 0 && (
            <>
              <p className="text-numeral font-medium tabular-nums">{average.toFixed(1)}</p>
              <Stars value={Math.round(average)} className="mt-3" />
              <span className="sr-only">Average rating {average.toFixed(1)} out of 5</span>
            </>
          )}
          <p className="mt-5 text-lg text-ink-soft">
            Average across {testimonials.length} {fromUpwork ? 'Upwork reviews' : 'client reviews'}
          </p>
          {credentials.length > 0 && (
            <ul className="mt-6 space-y-1">
              {credentials.map((item) => (
                <li key={item.label} className="label text-ink">
                  {item.value} · {item.label.replace(/ on Upwork$/i, '')}
                </li>
              ))}
            </ul>
          )}
          {fromUpwork && site.links.upwork && (
            <ExternalLink href={site.links.upwork} className="mt-8 font-medium">
              <span className="link-underline">Read the reviews on Upwork</span>
            </ExternalLink>
          )}
        </Reveal>

        <div className="col-span-full lg:col-span-7 lg:col-start-6">
          <Reveal as="figure">
            <blockquote className="text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-medium leading-snug tracking-[-0.015em]">
              <p>“{featured.quote}”</p>
            </blockquote>
            <figcaption className="label mt-5">{caption(featured)}</figcaption>
          </Reveal>

          {listed.length > 0 && (
            <div className="mt-12">
              {listed.map((item) => (
                <Quote key={item.id} item={item} />
              ))}
              <div id={listId} hidden={!expanded}>
                {extra.map((item) => (
                  <Quote key={item.id} item={item} />
                ))}
              </div>
              {extra.length > 0 && (
                <div className="border-t border-ink/15 pt-6">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={listId}
                    onClick={() => setExpanded((value) => !value)}
                    className="link-underline font-medium"
                  >
                    {expanded ? 'Show fewer reviews' : `Show all ${testimonials.length} reviews`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
