import { useId, useState } from 'react'
import ProjectImage from './ProjectImage'

/** Drag (or use arrow keys on) the slider to compare two screenshots of the same view. */
export default function BeforeAfter({ pair, title }) {
  const [position, setPosition] = useState(50)
  const id = useId()
  const { before, after } = pair

  if (!before || !after || before.missing || after.missing) return null

  return (
    <figure>
      <div className="relative select-none overflow-hidden">
        <ProjectImage image={after} alt={`${title}: after`} sizes="(min-width: 1024px) 80vw, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <ProjectImage image={before} alt={`${title}: before`} sizes="(min-width: 1024px) 80vw, 100vw" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-paper shadow-[0_0_0_1px_rgba(21,21,19,0.4)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-2.5 py-1 font-mono text-[0.65rem] uppercase text-paper">
            ↔
          </span>
        </div>
        <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-0.5 text-ink" aria-hidden="true">Before</span>
        <span className="label absolute right-3 top-3 bg-paper/90 px-2 py-0.5 text-ink" aria-hidden="true">After</span>
        <label htmlFor={id} className="sr-only">
          Compare before and after{pair.label ? `: ${pair.label}` : ''}. Lower values show more of the before image.
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {(pair.label || pair.caption) && (
        <figcaption className="mt-3 text-sm text-ink-muted">
          {pair.label && <span className="font-medium text-ink">{pair.label}. </span>}
          {pair.caption}
        </figcaption>
      )}
    </figure>
  )
}
