import { useEffect, useRef, useState } from 'react'
import { CONTACT_FACTS, GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data'
import Section from '@/components/layout/Section'

function useCopyEmail(email: string) {
  const [label, setLabel] = useState('Copy')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setLabel('Copied')
    } catch {
      setLabel('Copy failed')
    }
    timer.current = window.setTimeout(() => setLabel('Copy'), 2000)
  }

  return { label, copy }
}

export default function Contact() {
  const { label, copy } = useCopyEmail(GENERAL_INFO.email)

  const mailto = `mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(
    GENERAL_INFO.emailSubject,
  )}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`

  const github = SOCIAL_LINKS.find((link) => link.name === 'github')
  const linkedin = SOCIAL_LINKS.find((link) => link.name === 'linkedin')

  const facts = CONTACT_FACTS.filter(
    (fact) => fact.value !== '' && (GENERAL_INFO.available || fact.label !== 'OPEN TO'),
  )

  return (
    <Section
      id="contact"
      index="05"
      label="CONTACT"
      title="Building something with agents or data? Let's talk."
      last
    >
      <div
        data-reveal
        className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {facts.map((fact) => (
          <div key={fact.label} className="bg-bg p-5">
            <span className="label">{fact.label}</span>
            <p className="mt-2 font-mono text-sm text-ink">{fact.value}</p>
          </div>
        ))}

        <div className="col-span-full flex flex-col items-start gap-4 bg-bg p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="label">EMAIL</span>
            <div className="mt-2">
              <a
                href={mailto}
                className="relative inline-block break-all font-mono text-[clamp(1.4rem,3.5vw,2.5rem)] text-ink transition-colors hover:text-signal"
              >
                {GENERAL_INFO.email}
                <span
                  data-underline
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-px origin-left bg-faint"
                />
              </a>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              data-testid="copy-email"
              data-magnetic
              onClick={copy}
              className="inline-flex items-center gap-2 border border-line px-4 py-2 font-mono text-sm text-ink transition-colors hover:border-signal"
            >
              {label}
            </button>
            <span aria-live="polite" className="sr-only">
              {label}
            </span>
          </div>
        </div>

        {github && (
          <a
            href={github.url}
            target="_blank"
            rel="noreferrer"
            className="bg-bg p-5 font-mono text-sm text-ink transition-colors hover:text-signal lg:col-span-2"
          >
            GitHub ↗
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin.url}
            target="_blank"
            rel="noreferrer"
            className="bg-bg p-5 font-mono text-sm text-ink transition-colors hover:text-signal lg:col-span-2"
          >
            LinkedIn ↗
          </a>
        )}
      </div>
    </Section>
  )
}
