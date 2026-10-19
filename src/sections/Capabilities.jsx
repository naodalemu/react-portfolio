import { site } from '../content'
import { techIcon } from '../utils/techIcons'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'

function Tile({ name }) {
  const icon = techIcon(name)
  return (
    <li
      title={name}
      className="group flex flex-col items-center justify-center gap-2.5 rounded-lg border border-ink/10 bg-paper px-2 py-4 text-center transition-colors duration-300 hover:border-ink/25 hover:bg-white"
    >
      {icon ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-ink transition-colors duration-300 group-hover:fill-[var(--brand)]" style={{ '--brand': `#${icon.hex}` }}>
          <path d={icon.path} />
        </svg>
      ) : (
        <span aria-hidden="true" className="flex h-7 items-center font-mono text-[0.95rem] font-semibold tracking-tight">
          {name}
        </span>
      )}
      <span className={`text-[0.75rem] leading-tight text-ink-soft ${icon ? '' : 'sr-only'}`}>{name}</span>
    </li>
  )
}

export default function Capabilities() {
  const groups = site.capabilities ?? []
  const logoGroups = groups.filter((group) => group.display === 'logos')
  const also = groups.filter((group) => group.display !== 'logos')
  if (!groups.length) return null

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="pb-section">
      <SectionHeading index="04" id="capabilities-title" aside="Stack, by layer">
        Capabilities
      </SectionHeading>

      <div className="page-grid mt-12 gap-y-8 md:mt-16">
        {logoGroups.map((group, index) => (
          <Reveal
            key={group.id}
            delay={index * 80}
            className="col-span-full grid gap-5 border-t border-ink/15 pt-6 lg:grid-cols-[16rem_1fr] lg:gap-8"
          >
            <div>
              <p className="label">{group.layer}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{group.title}</h3>
              {group.concepts?.length > 0 && <p className="mt-2 text-sm text-ink-muted">{group.concepts.join(' · ')}</p>}
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2 lg:grid-cols-[repeat(10,minmax(0,1fr))]">
              {group.tools.map((tool) => (
                <Tile key={tool} name={tool} />
              ))}
            </ul>
          </Reveal>
        ))}

        {also.length > 0 && (
          <div className="col-span-full flex flex-wrap items-center gap-2 border-t border-ink/15 pt-6">
            <p className="label mr-4">Also</p>
            {also.map((group) => (
              <span key={group.id} className="rounded-full border border-ink/15 px-4 py-2 text-[0.95rem]">
                {group.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
