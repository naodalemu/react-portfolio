import { site } from '../content'

export default function Footer() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="mx-auto flex max-w-page flex-col gap-3 border-t border-paper/15 px-gutter py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {new Date().getFullYear()} {site.name}. {site.footer?.text}
        </p>
        <a href="#top" className="label link-underline self-start text-paper sm:self-auto">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
