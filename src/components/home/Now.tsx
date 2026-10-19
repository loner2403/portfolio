import { HERO_STATS, MY_EXPERIENCE, type ExperienceType } from '@/lib/data'
import { cardBg } from '@/lib/cards'
import { formatRange } from '@/lib/format'
import { cn } from '@/lib/utils'
import Container from '@/components/layout/Container'
import Rail from '@/components/layout/Rail'

function shorten(text: string, limit = 140): string {
  const stop = text.indexOf(' with ')
  let value = stop === -1 ? text : text.slice(0, stop)
  let cut = value !== text

  if (value.length > limit) {
    value = value.slice(0, limit)
    const space = value.lastIndexOf(' ')
    value = space > 0 ? value.slice(0, space) : value
    cut = true
  }

  value = value.trim().replace(/[,;:]+$/, '')

  return cut ? `${value}…` : value
}

function Role({ item, points = 1 }: { item: ExperienceType; points?: number }) {
  const lines = (item.points ?? []).slice(0, points).map((point) => shorten(point))

  return (
    <div className="mt-5 flex flex-col">
      <span className="font-mono text-xs text-muted">{item.company}</span>
      <p className="mt-2 text-[15px] leading-[1.6] text-ink">{item.title}</p>
      <span className="mt-2 font-mono text-xs text-muted">{formatRange(item.duration)}</span>
      {lines.length > 0 && (
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={line} className="text-[15px] leading-[1.6] text-ink">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Proof() {
  return (
    <section data-testid="proof" className="relative border-t border-line py-16 lg:py-24">
      <Rail />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <div data-reveal>
              <span className="label">NOW</span>
              <Role item={MY_EXPERIENCE[0]} points={2} />
            </div>
            <div data-reveal className="mt-8 border-t border-line pt-6">
              <span className="label">BEFORE</span>
              <Role item={MY_EXPERIENCE[1]} />
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-px border border-line bg-line lg:col-span-7">
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                data-testid="metric"
                data-reveal
                className="flex min-h-[11rem] flex-col bg-bg p-5 md:p-8"
              >
                <span aria-hidden="true" className={cn('h-1 w-10', cardBg(index))} />
                <span className="mt-5 font-display text-[clamp(3rem,6vw,5rem)] leading-none tabular-nums text-ink">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="label mt-3 max-w-[22ch]">{stat.label}</span>
                <span className="mt-auto pt-3 font-mono text-xs text-muted">{stat.source}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
