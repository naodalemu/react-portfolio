import { ArrowUpRight } from 'lucide-react'

export default function ExternalLink({ href, children, className = '', icon = true, ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-baseline gap-1 ${className}`} {...props}>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden="true"
          className="h-[0.85em] w-[0.85em] shrink-0 translate-y-[0.1em] transition-transform duration-300 ease-out-expo group-hover:-translate-y-[0.05em] group-hover:translate-x-[0.15em]"
        />
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
