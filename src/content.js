// Validated content from src/data/*.json, produced at build time by
// plugins/content.js. Unpublished projects are not included in production.
import content from 'virtual:portfolio-content'

// `contentSet` is "demo" or "fixtures" when previewing alternative content; empty in production.
export const { site, projects, testimonials, experience, contentSet } = content

const { serviceId, templateId, publicKey } = site.contact?.emailjs ?? {}
/** The contact form only renders when all three EmailJS identifiers are set. */
export const hasContactForm = Boolean(serviceId && templateId && publicKey)
