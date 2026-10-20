import { hasContactForm, site } from '../content'
import SectionHeading from '../components/SectionHeading'
import ExternalLink from '../components/ExternalLink'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  const { contact, links } = site
  const socials = [
    links.github && { label: 'GitHub', href: links.github },
    links.linkedin && { label: 'LinkedIn', href: links.linkedin },
    links.upwork && { label: 'Upwork', href: links.upwork },
    ...links.other.map((link) => ({ label: link.label, href: link.url })),
  ].filter(Boolean)
  const hasForm = hasContactForm

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark bg-ink pt-section text-paper">
      <SectionHeading index="06" id="contact-title">
        Contact
      </SectionHeading>

      <div className="page-grid mt-12 gap-y-16 pb-section md:mt-16">
        <div className={`col-span-full ${hasForm ? 'lg:col-span-6' : 'lg:col-span-10'}`}>
          <p className="text-title font-semibold">
            {contact.heading.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="font-serif font-normal italic">{contact.heading.split(' ').slice(-2).join(' ')}</span>
          </p>
          <p className="mt-8 max-w-prose text-lg leading-relaxed text-fog">{contact.text}</p>

          {site.email && (
            <a href={`mailto:${site.email}`} className="link-underline mt-10 inline-block text-[clamp(1.4rem,1rem+1.6vw,2.25rem)] font-medium [overflow-wrap:anywhere]">
              {site.email}
            </a>
          )}

          {socials.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3" aria-label="Elsewhere">
              {socials.map((item) => (
                <li key={item.label}>
                  <ExternalLink href={item.href} className="text-lg transition-colors hover:text-signal-bright">
                    {item.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          )}
          <p className="label mt-12">
            Working with clients remotely, across time zones.
          </p>
        </div>

        {hasForm && (
          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <h3 className="sr-only">Send a message</h3>
            <ContactForm />
          </div>
        )}
      </div>
    </section>
  )
}
