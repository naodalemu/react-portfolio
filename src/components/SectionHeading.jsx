/** Thin index rule that opens each section: "(02) Technical impact". */
export default function SectionHeading({ index, children, id, aside }) {
  return (
    <div className="page-grid">
      <div className="col-span-full flex items-baseline justify-between gap-6 rule-line border-t pt-4">
        <h2 id={id} className="label">
          <span aria-hidden="true">({index})&ensp;</span>
          {children}
        </h2>
        {aside && <p className="label hidden sm:block">{aside}</p>}
      </div>
    </div>
  )
}
