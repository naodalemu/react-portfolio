import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { projects, site } from '../content'
import { getFeaturedProjects, getPublishedProjects } from '../utils/projectHelpers'
import ProjectList from '../components/ProjectList'
import ExternalLink from '../components/ExternalLink'
import Magnetic from '../components/Magnetic'

export default function SelectedWork() {
  const featured = getFeaturedProjects(projects)
  const published = getPublishedProjects(projects)

  return (
    <section id="work" data-theme="dark" aria-labelledby="work-title" className="on-dark bg-ink text-paper">
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="flex items-baseline justify-between gap-6">
          <h2 id="work-title" className="text-[clamp(2.5rem,1.4rem+4vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
            Selected work
          </h2>
          {featured.length > 0 && <p className="label">{String(featured.length).padStart(2, '0')} of {String(published.length).padStart(2, '0')}</p>}
        </div>

        {featured.length > 0 ? (
          <>
            <div className="mt-12 md:mt-16">
              <ProjectList projects={featured} />
            </div>
            {published.length > featured.length && (
              <div className="mt-12 flex justify-end">
                <Magnetic>
                  <Link
                    to="/work"
                    viewTransition
                    className="group inline-flex h-14 items-center gap-3 rounded-full border border-paper/25 px-7 font-medium transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                  >
                    See all work ({published.length})
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8">
            <p className="max-w-prose text-lg text-fog">Case studies are being written up.</p>
            {site.links.github && (
              <ExternalLink href={site.links.github} className="mt-6 font-medium">
                <span className="link-underline">Browse my GitHub</span>
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
