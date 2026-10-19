/** A measured outcome. Context is required by the schema so numbers never stand alone. */
export default function Metric({ metric, size = 'large' }) {
  const value = (
    <>
      {metric.before && (
        <>
          <span className="text-ink-muted">{metric.before}</span>
          <span className="mx-[0.2em] font-sans text-[0.6em] text-signal" aria-label="to">
            →
          </span>
        </>
      )}
      {metric.value}
      {metric.unit && <span className="ml-[0.1em] text-[0.45em] tracking-normal">{metric.unit}</span>}
    </>
  )

  return (
    <div className="border-t border-ink/15 pt-4">
      <p className={size === 'large' ? 'text-numeral font-medium' : 'text-heading font-medium'}>{value}</p>
      <p className="mt-3 font-medium">{metric.label}</p>
      <p className="mt-1 max-w-prose text-sm text-ink-muted">{metric.context}</p>
    </div>
  )
}
