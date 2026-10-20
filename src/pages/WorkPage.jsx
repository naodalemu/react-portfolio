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
    <section data-theme="dark" aria-labelledby="all-work-title" className="on-dark min-h-[100svh] bg-ink pb-section pt-36 text-paper md:pt-44">
      <div className="mx-auto max-w-page px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
