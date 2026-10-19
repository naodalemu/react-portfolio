/**
 * Renders a project image resolved by the content plugin ({ src, width,
 * height, srcSet, alt, caption, frame }). Dimensions are always reserved so
 * nothing shifts while loading. Missing images become a deliberate placeholder.
 *
 * fit="natural" keeps the screenshot's own aspect ratio; fit="cover" fills a
 * fixed `aspect` box and crops.
 */
export default function ProjectImage({
  image,
  alt,
  title = '',
  sizes = '100vw',
  priority = false,
  fit = 'natural',
  aspect = '16 / 10',
  frame = 'none',
  accent = '',
  className = '',
  imgClassName = '',
  viewTransitionName,
}) {
  const transition = viewTransitionName ? { viewTransitionName } : undefined

  if (!image || image.missing) {
    return (
      <Placeholder
        title={title}
        accent={accent}
        aspect={fit === 'cover' || !image?.width ? aspect : `${image.width} / ${image.height}`}
        className={className}
        style={transition}
      />
    )
  }

  const resolvedFrame = image.frame && image.frame !== 'auto' ? image.frame : frame
  const ratio = image.width && image.height ? `${image.width} / ${image.height}` : aspect
  const img = (
    <img
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={image.alt || alt || ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={
        fit === 'cover'
          ? `absolute inset-0 h-full w-full object-cover object-top ${imgClassName}`
          : `block h-auto w-full ${imgClassName}`
      }
    />
  )

  const body =
    fit === 'cover' ? (
      <div className="relative overflow-hidden bg-paper-deep" style={{ aspectRatio: aspect }}>
        {img}
      </div>
    ) : (
      <div className="relative overflow-hidden bg-paper-deep" style={{ aspectRatio: ratio }}>
        {img}
      </div>
    )

  if (resolvedFrame === 'browser') {
    return (
      <div className={`overflow-hidden rounded-md border border-ink/15 bg-paper shadow-[0_30px_60px_-30px_rgba(21,21,19,0.35)] ${className}`} style={transition}>
        <div className="flex h-7 items-center gap-1.5 border-b border-ink/10 px-3" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
        </div>
        {body}
      </div>
    )
  }

  if (resolvedFrame === 'device') {
    return (
      <div className={`rounded-[2rem] bg-ink p-2 shadow-[0_30px_60px_-30px_rgba(21,21,19,0.45)] ${className}`} style={transition}>
        <div className="overflow-hidden rounded-[1.5rem]">{body}</div>
      </div>
    )
  }

  return (
    <div className={className} style={transition}>
      {body}
    </div>
  )
}

function Placeholder({ title, accent, aspect, className, style }) {
  return (
    <div
      role="img"
      aria-label={title ? `${title}: image not yet available` : 'Image not yet available'}
      className={`relative flex items-end overflow-hidden bg-paper-deep p-5 ${className}`}
      style={{
        aspectRatio: aspect,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${accent || 'rgba(21,21,19,0.07)'} 14px 15px)`,
        ...style,
      }}
    >
      <span className="font-serif text-2xl italic text-ink-muted md:text-3xl" aria-hidden="true">
        {title}
      </span>
    </div>
  )
}
