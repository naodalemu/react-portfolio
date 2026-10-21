import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { projects, site } from '../content'
import { getPublishedProjects } from '../utils/projectHelpers'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useSplitReveal } from '../hooks/useSplitReveal'
import ProjectList from '../components/ProjectList'

export default function WorkPage() {
  const published = getPublishedProjects(projects)
  const title = useSplitReveal({ type: 'chars', stagger: 0.03, onLoad: true })
  useDocumentMeta({ title: `Work | ${site.name}`, description: `Every published project by ${site.name}: case studies in SaaS, e-commerce, APIs and tools.`, path: '/work' })

  return (
    <section data-theme="dark" aria-labelledby="all-work-title" className="on-dark min-h-[100svh] bg-ink pb-section pt-28 text-paper md:pt-32">
      <div className="mx-auto max-w-page px-gutter">
        <Link to="/" viewTransition className="label group inline-flex items-center gap-2 text-paper transition-colors hover:text-signal-bright">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5" />
          Home
        </Link>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 md:mt-14">
          <h1 ref={title} id="all-work-title" className="text-[clamp(3rem,1.6rem+7vw,9rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            All work
          </h1>
          <p className="label pb-3">{String(published.length).padStart(2, '0')} projects</p>
        </div>
        <div className="mt-14 md:mt-20">
          <ProjectList projects={published} />
        </div>
      </div>
    </section>
  )
}
