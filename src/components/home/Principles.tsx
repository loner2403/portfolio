import { PRINCIPLES } from '@/lib/data'

const SEEN_LINK =
  'inline-flex items-center font-mono text-xs text-faint underline-offset-4 hover:text-signal hover:underline [@media(pointer:coarse)]:min-h-11'

export default function Principles() {
  return (
    <div data-reveal className="mt-20">
      <h3 className="label">HOW I BUILD</h3>
      <ol className="mt-6 border-t border-line">
        {PRINCIPLES.map((principle, index) => (
          <li
            key={principle.title}
            data-testid="principle"
            className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-line py-6 lg:grid-cols-[4rem_minmax(0,16rem)_minmax(0,1fr)_auto] lg:items-baseline lg:gap-x-8"
          >
            <span className="row-span-3 font-display text-4xl leading-none tabular-nums text-flame lg:row-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-lg font-medium text-ink">{principle.title}</span>
            <p className="col-start-2 max-w-[60ch] text-sm leading-relaxed text-muted lg:col-start-auto">
              {principle.line}
            </p>
            <span className="col-start-2 font-mono text-xs text-faint lg:col-start-auto">
              seen in{' '}
              {principle.seen.map((id, seenIndex) => (
                <span key={id}>
                  {seenIndex > 0 && ', '}
                  <a href={`#system-${id}`} className={SEEN_LINK}>
                    {id}
                  </a>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
