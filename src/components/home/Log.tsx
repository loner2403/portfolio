import { MY_EXPERIENCE, type ExperienceType } from '@/lib/data'
import { formatRange } from '@/lib/format'
import { cn } from '@/lib/utils'
import Section from '@/components/layout/Section'

function LogEntry({ item }: { item: ExperienceType }) {
  return (
    <article
      data-testid="log-entry"
      data-reveal
      className="py-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
    >
      <div className="self-start lg:sticky lg:top-24">
        <span className="block font-mono text-lg text-ink">{formatRange(item.duration)}</span>
        {item.current && (
          <span className="mt-2 block font-mono text-xs uppercase tracking-[0.08em] text-signal">
            current
          </span>
        )}
      </div>
      <div className={cn('mt-4 border-l-2 pl-6 lg:mt-0', item.current ? 'border-card-1' : 'border-line')}>
        <h3 className="text-2xl font-medium text-ink">{item.company}</h3>
        <p className="mt-1 text-muted">{item.title}</p>
        {item.location && <p className="mt-1 font-mono text-xs text-faint">{item.location}</p>}

        {item.points && item.points.length > 0 && (
          <ul className="mt-4 space-y-2">
            {item.points.slice(0, 2).map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-muted">
                <span className="mt-[7px] h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {item.skills && item.skills.length > 0 && (
          <p className="mt-4 font-mono text-xs text-muted">{item.skills.slice(0, 6).join(', ')}</p>
        )}
      </div>
    </article>
  )
}

export default function Log() {
  return (
    <Section id="log" index="03" label="LOG" title="Experience log">
      <div className="mt-10 divide-y divide-line border-t border-line">
        {MY_EXPERIENCE.map((item) => (
          <LogEntry key={`${item.company}-${item.duration}`} item={item} />
        ))}
      </div>
    </Section>
  )
}
