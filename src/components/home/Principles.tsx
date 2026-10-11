import { PRINCIPLES } from '@/lib/data'

export default function Principles() {
  return (
    <div data-reveal className="mt-16">
      <h3 className="label">HOW I BUILD</h3>
      <ul className="mt-4 border-t border-line">
        {PRINCIPLES.map((principle, index) => (
          <li
            key={principle.title}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-b border-line py-5 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-baseline md:gap-x-6"
          >
            <span className="font-mono text-xs text-faint">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-lg font-medium text-ink">{principle.title}</span>
            <span className="col-start-2 font-mono text-xs text-faint md:col-start-auto">
              seen in{' '}
              {principle.seen.map((id, seenIndex) => (
                <span key={id}>
                  {seenIndex > 0 && ' · '}
                  <a href={`#system-${id}`} className="font-mono text-xs text-faint hover:text-signal">
                    {id}
                  </a>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
