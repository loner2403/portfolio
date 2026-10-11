import { MY_EXPERIENCE, type ExperienceType } from '@/lib/data'
import { formatRange } from '@/lib/format'
import Section from '@/components/layout/Section'

function LogEntry({ item }: { item: ExperienceType }) {
  return (
    <article data-testid="log-entry" data-reveal className="max-w-3xl py-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <span>{formatRange(item.duration)}</span>
        {item.current && (
          <span className="inline-flex items-center gap-2 rounded-sm border border-line px-2.5 py-1 text-signal">
            <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
            now
          </span>
        )}
      </div>

      <h3 className="mt-3 text-2xl font-medium text-ink">{item.company}</h3>
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
        <div className="mt-4 flex flex-wrap gap-2">
          {item.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function Log() {
  return (
    <Section id="log" index="03" label="LOG" title="Experience log">
      <div className="mt-10">
        <div className="relative border-l border-line pl-6 md:pl-10">
          <span data-log-dot aria-hidden="true" className="absolute top-0 -left-[4px] z-10 h-[7px] w-[7px] bg-signal" />
          <div className="divide-y divide-line">
            {MY_EXPERIENCE.map((item) => (
              <LogEntry key={`${item.company}-${item.duration}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
