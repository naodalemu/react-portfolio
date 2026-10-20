import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects, site } from '../content'
import {
  clientLabel,
  coverTransitionName,
  getAdjacentProjects,
  getProjectBySlug,
  getRelatedProjects,
  hasGallery,
  paragraphs,
  projectLinks,
} from '../utils/projectHelpers'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProjectImage from '../components/ProjectImage'
import StackStrata from '../components/StackStrata'
import Metric from '../components/Metric'
import Gallery from '../components/Gallery'
import ExternalLink from '../components/ExternalLink'
import Reveal from '../components/Reveal'
import NotFoundPage from './NotFoundPage'
import { useSplitReveal } from '../hooks/useSplitReveal'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(projects, slug)

  // Production builds contain published projects only, so an unpublished
  // slug resolves to nothing and lands here.
  if (!project) return <NotFoundPage />
  return <CaseStudy key={project.slug} project={project} />
}

function CaseStudy({ project }) {
  useDocumentMeta({
    title: `${project.title} | ${site.name}`,
    description: project.subtitle || project.description,
    path: `/work/${project.slug}`,
  })

  const technicalFirst = project.presentation.caseStudy === 'technical'
  const visual = hasGallery(project) ? (
    <section aria-label="Screens" className="py-section">
      <Gallery project={project} />
    </section>
  ) : null
  const technical = <Engineering project={project} />

  return (
    <article>
      {project.draft && (
        <p role="note" className="fixed inset-x-0 bottom-0 z-50 bg-signal px-gutter py-2 text-center font-mono text-label uppercase text-paper">
          Draft preview, not published. This page does not exist in production builds.
        </p>
      )}

      <Intro project={project} />

      <div className="mx-auto max-w-page px-gutter">
        <Reveal variant="clip" className="overflow-hidden">
        <ProjectImage
          image={project.images.cover}
          title={project.title}
          accent={project.presentation.accent}
          alt={`${project.title} cover`}
          priority
          sizes="(min-width: 1600px) 1600px, 100vw"
          viewTransitionName={coverTransitionName(project)}
        />
        </Reveal>
        {project.images.cover?.caption && <p className="mt-3 text-sm text-ink-muted">{project.images.cover.caption}</p>}
      </div>

      <Facts project={project} />
      <Narrative project={project} />
      {technicalFirst ? (
        <>
          {technical}
          {visual}
        </>
      ) : (
        <>
          {visual}
          {technical}
        </>
      )}
      <Outcomes project={project} />
      <Footer project={project} />
    </article>
  )
}

function Intro({ project }) {
  const title = useSplitReveal({ type: 'chars', stagger: 0.025, onLoad: true })
  const meta = [project.category, project.projectType].filter(Boolean)
  const [primary, ...secondary] = projectLinks(project)
  const facts = [
    ['Role', project.role],
    ['Client', clientLabel(project)],
    ['Timeline', project.duration || project.year],
    ['Status', project.status],
    ['Team', project.team.join(', ')],
  ].filter(([, value]) => value)

  return (
    <header className="page-grid pb-12 pt-28 md:pb-16 md:pt-32">
      <div className="col-span-full flex flex-wrap items-baseline justify-between gap-4">
        <Link to="/work" viewTransition className="label group inline-flex items-center gap-2 text-ink transition-colors hover:text-signal">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5" />
          All work
        </Link>
        {meta.length > 0 && <p className="label">{meta.join('  /  ')}</p>}
      </div>

      <h1 ref={title} className="col-span-full mt-10 text-title font-semibold [overflow-wrap:break-word] [text-wrap:balance] md:mt-14">{project.title}</h1>

      <div className="col-span-full mt-10 grid gap-x-6 gap-y-10 border-t border-ink/15 pt-8 md:mt-14 lg:grid-cols-12">
        {project.subtitle && (
          <p className="max-w-[36ch] text-xl leading-snug text-ink md:text-2xl lg:col-span-6">{project.subtitle}</p>
        )}

        <div className="lg:col-span-5 lg:col-start-8">
          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="label">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {primary && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-2 bg-ink px-5 text-[0.95rem] font-medium text-paper transition-colors hover:bg-signal"
              >
                {primary.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              {secondary.map((link) => (
                <ExternalLink key={link.href} href={link.href} className="font-medium transition-colors hover:text-signal">
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Facts({ project }) {
  if (!project.techStack.length) return null

  return (
    <section aria-labelledby="stack-title" className="page-grid gap-y-4 pt-16 md:pt-24">
      <h2 id="stack-title" className="label col-span-full md:col-span-2 lg:col-span-3">
        Stack, surface to depth
      </h2>
      <div className="col-span-full md:col-span-6 lg:col-span-7 lg:col-start-5">
        <StackStrata techStack={project.techStack} variant="full" />
      </div>
    </section>
  )
}

/** A label in the margin and prose beside it — the case study's basic unit. */
function Block({ label, children }) {
  return (
    <Reveal as="section" className="page-grid gap-y-4 border-t border-ink/15 pt-6">
      <h2 className="label col-span-full md:col-span-2 lg:col-span-3">{label}</h2>
      <div className="col-span-full md:col-span-6 lg:col-span-7 lg:col-start-5">{children}</div>
    </Reveal>
  )
}

function Prose({ text, lead = false }) {
  return (
    <div className={`prose-body max-w-prose ${lead ? 'text-[1.35rem] leading-snug text-ink' : 'text-lg leading-relaxed text-ink-soft'}`}>
      {paragraphs(text).map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </div>
  )
}

function List({ items }) {
  return (
    <ul className="max-w-prose divide-y divide-ink/10 text-lg text-ink-soft">
      {items.map((item) => {
        const title = typeof item === 'string' ? item : item.title
        const description = typeof item === 'string' ? '' : item.description
        return (
          <li key={title} className="flex gap-4 py-3 first:pt-0">
            <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 bg-signal" />
            <span>
              <span className={description ? 'font-medium text-ink' : ''}>{title}</span>
              {description && <span className="mt-1 block text-base">{description}</span>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Narrative({ project }) {
  const blocks = [
    project.overview && ['Overview', <Prose key="o" text={project.overview} lead />],
    project.problem && ['The problem', <Prose key="p" text={project.problem} />],
    project.approach && ['Approach', <Prose key="a" text={project.approach} />],
    project.solution && ['What was built', <Prose key="s" text={project.solution} />],
    project.contributions.length > 0 && ['My contribution', <List key="c" items={project.contributions} />],
    project.features.length > 0 && ['Key features', <List key="f" items={project.features} />],
  ].filter(Boolean)

  // Projects with no write-up yet still get their description, so the page never reads empty.
  if (!blocks.length) blocks.push(['Overview', <Prose key="d" text={project.description} lead />])

  return (
    <div className="space-y-16 pt-section md:space-y-20">
      {blocks.map(([label, content]) => (
        <Block key={label} label={label}>
          {content}
        </Block>
      ))}
    </div>
  )
}

function Engineering({ project }) {
  const { decisions, challenges } = project
  if (!decisions.length && !challenges.length) return null

  return (
    <div className="space-y-16 py-section md:space-y-20">
      {decisions.length > 0 && (
        <Block label="Decisions & trade-offs">
          <ol className="max-w-prose space-y-10">
            {decisions.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[2.5rem_1fr]">
                <span className="label pt-1.5">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
                  {item.description && <p className="mt-3 text-lg leading-relaxed text-ink-soft">{item.description}</p>}
                  {item.tradeoff && (
                    <p className="mt-3 border-l-2 border-ink/20 pl-4 text-ink-muted">
                      <span className="label mr-2 text-ink">Trade-off</span>
                      {item.tradeoff}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Block>
      )}
      {challenges.length > 0 && (
        <Block label="Hard problems">
          <ol className="max-w-prose space-y-10">
            {challenges.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[2.5rem_1fr]">
                <span className="label pt-1.5">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
                  {item.description && <p className="mt-3 text-lg leading-relaxed text-ink-soft">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Block>
      )}
    </div>
  )
}

function Outcomes({ project }) {
  const metrics = project.visibility.showMetrics ? project.metrics : []
  const notes = [
    project.lessons.length > 0 && ['What I learned', project.lessons],
    project.constraints.length > 0 && ['Constraints', project.constraints],
  ].filter(Boolean)

  if (!metrics.length && !project.results.length && !notes.length) return null

  return (
    <section aria-labelledby="results-title" className="bg-paper-deep py-section">
      <div className="page-grid">
        <h2 id="results-title" className="label col-span-full">
          Results
        </h2>
      </div>
      {metrics.length > 0 && (
        <div className="page-grid mt-10 gap-y-12">
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 100} className="col-span-full md:col-span-4 lg:col-span-6">
              <Metric metric={metric} />
            </Reveal>
          ))}
        </div>
      )}
      {project.results.length > 0 && (
        <div className="page-grid mt-16">
          <div className="col-span-full md:col-span-6 lg:col-span-7 lg:col-start-5">
            <List items={project.results} />
          </div>
        </div>
      )}
      {notes.length > 0 && (
        <div className="page-grid mt-16 gap-y-10">
          {notes.map(([label, items]) => (
            <div key={label} className="col-span-full md:col-span-4 lg:col-span-6">
              <h3 className="label mb-4 border-t border-ink/20 pt-4">{label}</h3>
              <List items={items} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Footer({ project }) {
  const { previous, next } = getAdjacentProjects(projects, project.slug)
  const related = getRelatedProjects(projects, project)

  return (
    <footer className="pt-section">
      {related.length > 0 && (
        <div className="page-grid mb-section gap-y-4">
          <h2 className="label col-span-full lg:col-span-3">Related</h2>
          <ul className="col-span-full lg:col-span-9">
            {related.map((item) => (
              <li key={item.id} className="border-t border-ink/15">
                <Link to={`/work/${item.slug}`} viewTransition className="flex items-baseline justify-between gap-4 py-4 text-xl font-medium transition-colors hover:text-signal">
                  {item.title}
                  <span className="label">{item.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(previous || next) && (
        <nav aria-label="More projects" className="grid border-t border-ink/15 md:grid-cols-2">
          {previous && previous.slug !== next?.slug && (
            <Link to={`/work/${previous.slug}`} viewTransition className="group border-b border-ink/15 px-gutter py-10 transition-colors hover:bg-paper-deep md:border-b-0 md:border-r">
              <span className="label inline-flex items-center gap-2">
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="mt-3 block text-heading font-medium">{previous.title}</span>
            </Link>
          )}
          {next && (
            <Link to={`/work/${next.slug}`} viewTransition className="group px-gutter py-10 text-right transition-colors hover:bg-paper-deep md:col-start-2">
              <span className="label inline-flex items-center gap-2">
                Next <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span className="mt-3 block text-heading font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      )}

      <div className="on-dark bg-ink text-paper">
        <div className="page-grid gap-y-6 py-20 md:py-28">
          <p className="col-span-full text-heading font-semibold lg:col-span-8">
            {site.contact.heading}
          </p>
          <div className="col-span-full lg:col-span-4 lg:self-end lg:text-right">
            <Link to="/#contact" className="group inline-flex items-center gap-3 font-medium">
              <span className="link-underline">Start a conversation</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

