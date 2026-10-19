import { Link } from 'react-router'
import { projects, site } from '../content'
import { getProjectBySlug } from '../utils/projectHelpers'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

function Figure({ value }) {
  // "75 → 3" renders the arrow as a quiet accent between the two figures.
  const parts = value.split('→')
  if (parts.length !== 2) return value
  return (
    <>
      <span className="text-ink-muted">{parts[0].trim()}</span>
      <span className="mx-[0.18em] align-[0.08em] font-mono text-[0.5em] text-signal" aria-label="to">
        →
      </span>
      {parts[1].trim()}
    </>
  )
}

export default function Impact() {
  const { impact } = site
  const intro = useSplitReveal()
  if (!impact?.highlights?.length && !impact?.themes?.length) return null

  return (
    <section id="impact" aria-labelledby="impact-title" className="bg-paper-deep py-section">
      <SectionHeading index="02" id="impact-title">
        Technical impact
      </SectionHeading>

      {impact.intro && (
        <div className="page-grid mt-12 md:mt-16">
          <p ref={intro} className="col-span-full text-heading font-medium lg:col-span-9">
            {impact.intro}
          </p>
        </div>
      )}

      {impact.highlights?.length > 0 && (
        <div className="page-grid mt-16 gap-y-14 md:mt-24">
          {impact.highlights.map((item, index) => {
            const project = item.projectSlug ? getProjectBySlug(projects, item.projectSlug) : null
            return (
              <Reveal key={item.label} delay={index * 120} className="col-span-full border-t border-ink/20 pt-6 md:col-span-4 lg:col-span-6">
                <p className="text-numeral font-medium tabular-nums">
                  <Figure value={item.value} />
                </p>
                <p className="mt-5 text-lg font-medium">{item.label}</p>
                <p className="mt-2 max-w-md text-ink-muted">{item.context}</p>
                {project && !project.draft && (
                  <Link to={`/work/${project.slug}`} viewTransition className="link-underline mt-4 inline-block text-sm font-medium">
                    From {project.title}
                  </Link>
                )}
              </Reveal>
            )
          })}
        </div>
      )}

      {impact.themes?.length > 0 && (
        <div className="page-grid mt-16 md:mt-20">
          <div className="col-span-full flex flex-wrap items-center gap-2 border-t border-ink/20 pt-6">
            <h3 className="label mr-4">Problems I solve</h3>
            {impact.themes.map((theme) => (
              <span key={theme.title} title={theme.description} className="rounded-full border border-ink/20 px-4 py-2 text-[0.95rem]">
                {theme.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
