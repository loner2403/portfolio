import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react'
import AskHarshal from '@/components/ask/AskHarshal'
import type { Answer } from '@/lib/ask'

export interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  grounded?: boolean
  phrased?: boolean
  sources?: Answer['sources']
  suggestions?: string[]
  askable?: string
}

interface PanelProps {
  messages: Message[]
  draft: string
  inputRef: RefObject<HTMLTextAreaElement | null>
  onDraft: (value: string) => void
  onSubmit: (value: string) => void
  onSource: (anchor: string) => void
  onClose: () => void
  onFocusChange: (focused: boolean) => void
}

function chipLabel(title: string) {
  return title.length > 28 ? `${title.slice(0, 27)}…` : title
}

export default function Panel({
  messages,
  draft,
  inputRef,
  onDraft,
  onSubmit,
  onSource,
  onClose,
  onFocusChange,
}: PanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const count = messages.length

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ top: list.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [count])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    onSubmit(draft)
  }

  return (
    <div
      role="dialog"
      aria-label="Ask the site"
      className="probe-panel-in absolute right-0 bottom-full mb-3 flex max-h-[min(70vh,520px)] w-[calc(100vw-32px)] flex-col rounded-sm border border-line bg-panel font-sans text-ink md:w-[360px]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">ASK THE SITE</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="grid h-7 w-7 place-items-center font-mono text-base text-muted hover:text-ink"
        >
          ×
        </button>
      </div>

      <div
        ref={listRef}
        aria-live="polite"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
      >
        {messages.map((message) => (
          <div key={message.id} className="probe-msg-in">
            {message.role === 'user' ? (
              <p className="ml-auto max-w-[85%] bg-panel-2 px-3 py-2 text-[13px] leading-6 text-ink">
                {message.text}
              </p>
            ) : (
              <div className="max-w-[92%] text-[13px] leading-6 text-ink">
                <p>{message.text}</p>
                {message.phrased && (
                  <p className="mt-1 font-mono text-[10px] text-faint">phrased by a free AI model</p>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.map((source, index) => (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => onSource(source.anchor)}
                        className={`border px-2 py-1 font-mono text-[11px] text-muted hover:text-ink ${index === 0 ? 'border-signal' : 'border-line'}`}
                      >
                        {chipLabel(source.title)} →
                      </button>
                    ))}
                  </div>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => onSubmit(suggestion)}
                        className="border border-line px-3 py-2 text-left text-[13px] text-muted hover:bg-panel-2 hover:text-ink"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                {message.askable && <AskHarshal question={message.askable} />}
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(draft)
        }}
        className="flex items-end gap-2 border-t border-line p-3"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={draft}
          maxLength={200}
          aria-label="Your question"
          placeholder="Ask about the work…"
          onChange={(event) => onDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          className="min-h-10 max-h-24 flex-1 resize-none border border-line bg-bg px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus-visible:border-signal"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex h-10 items-center gap-2 border border-line px-3 font-mono text-[12px] text-ink hover:bg-panel-2 disabled:opacity-40"
        >
          Send <span className="text-faint">↵</span>
        </button>
      </form>

      <p className="border-t border-line px-4 py-2 text-[11px] text-faint">
        Answers come from this site's content. Matched questions may be sent to a free AI model to phrase the reply.
      </p>
    </div>
  )
}
