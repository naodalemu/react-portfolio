import { Link } from 'react-router'
import { site } from '../content'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFoundPage() {
  useDocumentMeta({ title: `Page not found | ${site.name}` })

  return (
    <section className="page-grid min-h-[80svh] content-center pb-section pt-40">
      <p className="label col-span-full">(404)</p>
      <h1 className="col-span-full mt-6 text-display">
        <span className="font-semibold">Nothing</span> <span className="font-serif font-normal italic">here.</span>
      </h1>
      <p className="col-span-full mt-8 max-w-prose text-lg text-ink-soft md:col-span-6">
        This page doesn&apos;t exist, or the project it pointed to isn&apos;t published.
      </p>
      <div className="col-span-full mt-10 flex gap-8">
        <Link to="/" viewTransition className="link-underline font-medium">
          Back to the homepage
        </Link>
        <Link to="/#work" className="link-underline font-medium">
          See selected work
        </Link>
      </div>
    </section>
  )
}
