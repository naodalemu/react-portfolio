import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import { site } from '../content'
import ExternalLink from '../components/ExternalLink'
import { useLocalTime } from '../hooks/useLocalTime'

const NAV = [
  { label: 'Work', to: '/#work' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
]

function useHideOnScroll(disabled) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (disabled) return
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 160)
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [disabled])

  return hidden && !disabled
}

/** True while the header sits over a section marked data-theme="dark". */
function useOverDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    let frame = 0
    const check = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // Probe the page just under the header bar (64px tall).
        const probe = 72
        const dark = [...document.querySelectorAll('[data-theme="dark"]')].some((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= probe && rect.bottom > probe
        })
        setDark(dark)
      })
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const observer = new MutationObserver(check)
    observer.observe(document.getElementById('main') ?? document.body, { childList: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])
  return dark
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const hidden = useHideOnScroll(open)
  const dark = useOverDark()
  const hours = site.workingHours
  const { time, zone } = useLocalTime(hours?.timeZone)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-[transform,background-color,color,border-color] duration-500 ease-out-expo focus-within:translate-y-0 ${
        dark ? 'on-dark border-paper/10 bg-ink/70 text-paper' : 'border-ink/10 bg-paper/90 text-ink'
      } ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-gutter">
        <Link to="/" viewTransition className="text-[0.95rem] font-semibold tracking-tight" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>

        {time && (
          <p className="label hidden lg:block">
            {hours.label}&ensp;·&ensp;<span className={`tabular-nums ${dark ? 'text-paper' : 'text-ink'}`}>{time}</span> {zone}
          </p>
        )}

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition-colors hover:text-signal">
                  {item.label}
                </Link>
              </li>
            ))}
            {site.resume && (
              <li>
                <ExternalLink href={site.resume} className="transition-colors hover:text-signal">
                  Résumé
                </ExternalLink>
              </li>
            )}
            {site.links.github && (
              <li>
                <ExternalLink href={site.links.github} className="transition-colors hover:text-signal">
                  GitHub
                </ExternalLink>
              </li>
            )}
            {site.links.linkedin && (
              <li>
                <ExternalLink href={site.links.linkedin} className="transition-colors hover:text-signal">
                  LinkedIn
                </ExternalLink>
              </li>
            )}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 items-center gap-2 px-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="label text-ink">Menu</span>
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </header>
    {/* Rendered outside <header>: its transform and backdrop-filter would trap a fixed overlay. */}
    {open && <MobileMenu onClose={close} hours={hours} time={time} zone={zone} />}
    </>
  )
}

function MobileMenu({ onClose, hours, time, zone }) {
  const panel = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    const element = panel.current
    element.querySelector('a, button')?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = [...element.querySelectorAll('a[href], button')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [onClose])

  const secondary = [
    site.resume && { label: 'Résumé', href: site.resume },
    site.links.github && { label: 'GitHub', href: site.links.github },
    site.links.linkedin && { label: 'LinkedIn', href: site.links.linkedin },
    site.links.upwork && { label: 'Upwork', href: site.links.upwork },
  ].filter(Boolean)

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-ink px-gutter text-paper on-dark md:hidden"
    >
      <div className="flex h-16 items-center justify-between">
        <span className="text-[0.95rem] font-semibold tracking-tight">{site.name}</span>
        <button type="button" onClick={onClose} className="-mr-2 inline-flex h-11 items-center gap-2 px-2">
          <span className="label text-paper">Close</span>
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-10 flex-1">
        <ul className="space-y-1">
          {NAV.map((item, index) => (
            <li key={item.label}>
              <Link to={item.to} onClick={onClose} className="flex items-baseline gap-4 py-2 text-[clamp(2.75rem,14vw,4.5rem)] font-medium leading-none tracking-tight">
                <span className="label">0{index + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {secondary.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-lg">
            {secondary.map((item) => (
              <li key={item.label}>
                <ExternalLink href={item.href}>{item.label}</ExternalLink>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <p className="label pb-8">
        {time ? (
          <span>
            {hours.label} · <span className="tabular-nums text-paper">{time}</span> {zone}
          </span>
        ) : (
          'Working with clients remotely'
        )}
      </p>
    </div>
  )
}
