import { groupStackByLayer, layersTouched } from '../utils/projectHelpers'

/**
 * The site's signature diagram: a cross-section of the stack showing which
 * layers a project reaches, from the interface down to infrastructure.
 */
export default function StackStrata({ techStack, variant = 'compact' }) {
  if (!techStack?.length) return null
  return variant === 'compact' ? <Compact techStack={techStack} /> : <Full techStack={techStack} />
}

function Compact({ techStack }) {
  const layers = layersTouched(techStack)
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Layers of the stack this project covers">
      {layers.map((layer) => (
        <li key={layer.id} className={`label flex items-center gap-1.5 ${layer.active ? 'text-ink' : 'text-ink-muted'}`}>
          <span
            aria-hidden="true"
            className={`inline-block h-2 w-2 ${layer.active ? 'bg-signal' : 'border border-current'}`}
          />
          <span className={layer.active ? '' : 'line-through decoration-current/40'}>{layer.label}</span>
          <span className="sr-only">{layer.active ? '(covered)' : '(not part of this project)'}</span>
        </li>
      ))}
    </ul>
  )
}

function Full({ techStack }) {
  const groups = groupStackByLayer(techStack)
  return (
    <dl className="border-b border-ink/15">
      {groups.map((group, index) => (
        <div key={group.id} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-ink/15 py-3 sm:grid-cols-[10rem_1fr]">
          <dt className="label flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 bg-signal"
              style={{ opacity: 1 - index * 0.16 }}
            />
            {group.label}
          </dt>
          <dd className="text-base text-ink">{group.items.map((item) => item.name).join(' / ')}</dd>
        </div>
      ))}
    </dl>
  )
}
