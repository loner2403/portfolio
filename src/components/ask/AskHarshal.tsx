import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

const TIMEOUT = 8000

type Phase = 'closed' | 'open' | 'sending' | 'sent'

type Outcome = { ok: true } | { ok: false; reason: string }

function readOutcome(data: unknown): Outcome | null {
  if (typeof data !== 'object' || data === null || !('ok' in data) || typeof data.ok !== 'boolean') return null
  if (data.ok) return { ok: true }
  const reason = 'reason' in data && typeof data.reason === 'string' ? data.reason : ''
  return { ok: false, reason }
}

interface AskHarshalProps {
  question: string
}

export default function AskHarshal({ question }: AskHarshalProps) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const focused = useRef(false)
  const emailId = useId()

  useEffect(() => {
    if (phase === 'open' && !focused.current) {
      focused.current = true
      emailRef.current?.focus({ preventScroll: true })
    }
    if (phase === 'open' || phase === 'sent' || error) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      rootRef.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
    }
  }, [phase, error])

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (phase === 'sending') return
    setError(null)
    setPhase('sending')
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT)
    try {
      const response = await fetch('/api/unanswered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          email: email.trim(),
          page: window.location.pathname,
          website,
        }),
        signal: controller.signal,
      })
      const outcome = readOutcome(await response.json().catch(() => null))
      if (response.ok && outcome?.ok) {
        setPhase('sent')
        return
      }
      if (response.status === 400 && outcome && !outcome.ok && outcome.reason === 'bad-email') {
        setError('Check the email address and try again.')
      } else if (response.status === 429) {
        setError('Too many messages. Try again later.')
      } else {
        setError("Couldn't send. Use the contact section instead.")
      }
      setPhase('open')
    } catch {
      setError("Couldn't send. Use the contact section instead.")
      setPhase('open')
    } finally {
      window.clearTimeout(timer)
    }
  }

  if (phase === 'closed') {
    return (
      <button
        type="button"
        onClick={() => setPhase('open')}
        className="mt-3 border border-line px-2 py-1 font-mono text-[11px] text-muted hover:text-ink"
      >
        Ask Harshal directly →
      </button>
    )
  }

  if (phase === 'sent') {
    return (
      <p
        ref={(node) => {
          rootRef.current = node
        }}
        role="status"
        className="mt-3 text-[12px] text-muted"
      >
        Sent. Harshal will see it and reply by email if you left one.
      </p>
    )
  }

  return (
    <form
      ref={(node) => {
        rootRef.current = node
      }}
      onSubmit={send}
      className="mt-3 space-y-2"
    >
      <label htmlFor={emailId} className="block text-[11px] text-muted">
        Your email (optional), so Harshal can reply
      </label>
      <input
        id={emailId}
        ref={emailRef}
        type="email"
        name="email"
        autoComplete="email"
        spellCheck={false}
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="block min-h-10 w-full border border-line bg-bg px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus-visible:border-signal"
      />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <button
        type="submit"
        disabled={phase === 'sending'}
        className="flex h-10 items-center gap-2 border border-line px-3 font-mono text-[12px] text-ink hover:bg-panel-2 disabled:opacity-40"
      >
        {phase === 'sending' ? 'Sending…' : 'Send to Harshal'}
      </button>
      <p className="text-[11px] text-faint">Only your question and email go to Harshal, via Telegram.</p>
      {error && (
        <p role="status" className="text-[12px] text-muted">
          {error}
        </p>
      )}
    </form>
  )
}
