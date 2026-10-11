import { m, useReducedMotion } from 'motion/react'
import { HERO_STATS } from '@/lib/data'
import Container from '@/components/layout/Container'
import Rail from '@/components/layout/Rail'

export default function Metrics() {
  const reduced = useReducedMotion() ?? false

  return (
    <section data-testid="metrics" className="relative border-t border-line py-16 lg:py-20">
      <Rail />
      <Container>
        <div className="grid grid-cols-2 border-y border-line max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(n+3)]:border-line max-lg:[&>*:nth-child(odd)]:border-r max-lg:[&>*:nth-child(odd)]:border-line lg:grid-cols-4 lg:divide-x lg:divide-line">
          {HERO_STATS.map((stat, index) => (
            <div key={stat.label} data-reveal className="flex flex-col p-6 md:p-8">
              <m.span
                className="h-0.5 w-8 origin-left bg-signal"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={reduced ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
              />
              <div className="mt-5 flex items-baseline font-mono text-[clamp(2.5rem,5vw,4rem)] font-medium tabular-nums tracking-[-0.03em] text-ink">
                <span>{stat.value}{stat.suffix}</span>
              </div>
              <span className="label mt-3 max-w-[22ch]">{stat.label}</span>
              <span className="mt-2 block font-mono text-xs text-muted">{stat.source}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
