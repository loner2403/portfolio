import { useEffect, useRef, useState } from 'react'
import { CONTACT_FACTS, GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data'
import Section from '@/components/layout/Section'

const LINK = 'inline-flex min-h-11 items-center font-mono text-sm text-ink underline underline-offset-4'

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
      tone="signal"
      last
    >
      <div data-reveal className="mt-10">
        <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <span className="label">{fact.label}</span>
              <p className="mt-2 font-mono text-sm text-ink">{fact.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-6 border-t border-line pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="label">EMAIL</span>
            <a
              href={mailto}
              className="mt-2 block break-all font-mono text-[clamp(1.25rem,4vw,3rem)] text-ink underline decoration-1 underline-offset-[6px]"
            >
              {GENERAL_INFO.email}
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2">
            <button
              type="button"
              data-testid="copy-email"
              data-magnetic
              onClick={copy}
              className="inline-flex min-h-11 items-center border border-ink px-5 font-mono text-sm text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              {label}
            </button>
            <span aria-live="polite" className="sr-only">
              {label}
            </span>
            {label === 'Copy failed' && <span className="text-sm text-ink">Use the email link above</span>}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6">
          {github && (
            <a href={github.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub ↗
            </a>
          )}
          {linkedin && (
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              LinkedIn ↗
            </a>
          )}
          {GENERAL_INFO.resumeUrl && (
            <a href={GENERAL_INFO.resumeUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              Résumé ↗
            </a>
          )}
        </div>
      </div>
    </Section>
  )
}
