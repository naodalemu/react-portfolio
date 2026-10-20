import { experience, site } from '../content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

export default function About() {
  const { about, credentials, profileImage } = site
  const [lead, ...body] = about.bio
  const hasPhoto = profileImage && !profileImage.missing

  return (
    <section id="about" aria-labelledby="about-title" className="py-section">
      <SectionHeading index="03" id="about-title">
        About
      </SectionHeading>

      <div className="page-grid mt-12 gap-y-12 md:mt-16 lg:items-start">
        {hasPhoto && (
          <Reveal as="figure" variant="clip" className="col-span-full sm:col-span-3 md:col-span-4 lg:sticky lg:top-24 lg:col-span-5">
            <div className="overflow-hidden bg-paper-deep" style={{ aspectRatio: `${profileImage.width} / ${profileImage.height}` }}>
              <img
                src={profileImage.src}
                width={profileImage.width}
                height={profileImage.height}
                alt={profileImage.alt || `Portrait of ${site.name}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="label mt-3 flex justify-between gap-4">
              <span>{site.name}</span>
              <span>{site.title}</span>
            </figcaption>
          </Reveal>
        )}

        <div className={`col-span-full ${hasPhoto ? 'md:col-span-8 lg:col-span-6 lg:col-start-7' : 'lg:col-span-8'}`}>
          <Reveal as="p" className="text-[clamp(1.9rem,1.2rem+2.2vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] [text-wrap:balance]">
            {about.statement}
          </Reveal>

          {lead && <p className="mt-10 text-xl leading-relaxed text-ink">{lead}</p>}
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}

          {about.facts?.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 border-t border-ink/15">
              {about.facts.map((fact, index) => (
                <div key={fact.label} className={`border-b border-ink/15 py-4 ${index % 2 ? 'pl-5' : 'pr-5'}`}>
                  <dt className="label">{fact.label}</dt>
                  <dd className="mt-1.5 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {credentials?.items?.length > 0 && (
        <div className="page-grid mt-section">
          <h3 className="sr-only">Record</h3>
          <ul className="col-span-full grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
            {credentials.items.map((item, index) => (
              <Reveal
                as="li"
                key={item.label}
                delay={index * 90}
                className="border-b border-ink/15 py-6 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-6"
              >
                <p className="text-[clamp(2rem,1.2rem+2.6vw,3.75rem)] font-medium leading-none tracking-tight">{item.value}</p>
                <p className="mt-3 text-sm text-ink-muted">{item.label}</p>
              </Reveal>
            ))}
          </ul>
          {credentials.note && <p className="label col-span-full mt-4">{credentials.note}</p>}
        </div>
      )}

      {experience.length > 0 && (
        <div className="page-grid mt-section gap-y-6">
          <h3 className="label col-span-full lg:col-span-3">Experience</h3>
          <ol className="col-span-full lg:col-span-9">
            {experience.map((item) => (
              <li key={item.id} className="grid gap-x-6 gap-y-1 border-t border-ink/15 py-6 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.2fr)]">
                <p className="label pt-1 tabular-nums">
                  {item.start} – {item.end || 'Present'}
                </p>
                <div>
                  <h4 className="text-xl font-medium tracking-tight">{item.role}</h4>
                  <p className="text-ink-muted">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                        {item.organization}
                      </a>
                    ) : (
                      item.organization
                    )}
                    {item.location && ` · ${item.location}`}
                  </p>
                </div>
                {item.summary && <p className="text-ink-soft">{item.summary}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
