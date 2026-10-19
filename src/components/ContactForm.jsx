import { useId, useState } from 'react'
import { site } from '../content'

// Field names match the variables in the EmailJS template:
// {{senderName}}, {{senderEmail}}, {{messageSubject}}, {{contactMessage}}.
const FIELDS = [
  { name: 'senderName', label: 'Your name', type: 'text', autoComplete: 'name', required: true },
  { name: 'senderEmail', label: 'Email address', type: 'email', autoComplete: 'email', required: true },
  { name: 'messageSubject', label: 'Subject', type: 'text', autoComplete: 'off', required: false },
]

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [sentTo, setSentTo] = useState('')
  const id = useId()

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')

    try {
      // Loaded on demand so EmailJS never weighs down the initial page.
      const { default: emailjs } = await import('@emailjs/browser')
      const { serviceId, templateId, publicKey } = site.contact.emailjs
      await emailjs.send(serviceId, templateId, data, { publicKey })
      form.reset()
      setSentTo(data.senderEmail)
      setStatus('sent')
    } catch (error) {
      console.error('Contact form failed to send:', error?.text ?? error)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="border-t border-paper/20 pt-6">
        <p className="font-serif text-4xl italic">Message sent.</p>
        <p className="mt-3 text-fog">Thanks, I&apos;ll reply to {sentTo} by email.</p>
        <button type="button" onClick={() => setStatus('idle')} className="label link-underline mt-8 text-paper">
          Send another message
        </button>
      </div>
    )
  }

  const inputClass =
    'mt-2 block w-full border-0 border-b border-paper/25 bg-transparent px-0 py-3 text-lg text-paper placeholder:text-fog/60 transition-colors focus:border-signal-bright focus:outline-none focus:ring-0 focus-visible:outline-none [&:user-invalid]:border-signal-bright'

  return (
    <form onSubmit={handleSubmit} aria-describedby={`${id}-status`} className="grid gap-7">
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={`${id}-${field.name}`} className="label">
            {field.label}
            {!field.required && <span className="normal-case"> (optional)</span>}
          </label>
          <input
            id={`${id}-${field.name}`}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            required={field.required}
            maxLength={field.name === 'messageSubject' ? 140 : 120}
            className={inputClass}
          />
        </div>
      ))}
      <div>
        <label htmlFor={`${id}-message`} className="label">
          What can I help you with?
        </label>
        <textarea id={`${id}-message`} name="contactMessage" required rows={5} maxLength={5000} className={`${inputClass} resize-y`} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-12 items-center bg-paper px-6 font-medium text-ink transition-colors hover:bg-signal-bright disabled:cursor-wait disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p id={`${id}-status`} role="status" aria-live="polite" className="text-sm text-fog">
          {status === 'error' && (
            <span className="text-signal-bright">
              Your message didn&apos;t send. Please try again in a moment
              {site.email ? (
                <>
                  , or email me at{' '}
                  <a href={`mailto:${site.email}`} className="link-underline text-paper">
                    {site.email}
                  </a>
                </>
              ) : null}
              .
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
