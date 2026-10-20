import { useReveal } from '../hooks/useReveal'

/** Fades/rises its content in once on scroll. `variant="clip"` wipes images open instead. */
export default function Reveal({ as: Tag = 'div', variant = '', delay = 0, style, ...props }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...props}
    />
  )
}
