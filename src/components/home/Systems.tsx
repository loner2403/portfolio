import type { CSSProperties } from 'react'
import { SYSTEMS } from '@/lib/data'
import Section from '@/components/layout/Section'
import Principles from '@/components/home/Principles'
import SystemArchitecture from '@/components/home/SystemArchitecture'
import { cn } from '@/lib/utils'

export default function Systems() {
  return (
    <Section id="systems" index="01" label="SYSTEMS" title="Systems I've built">
      <p data-reveal className="mt-6 max-w-2xl text-muted">
        Illustrative architectures from my AI and data platform work. Names and details are generalised.
      </p>

      <div className="mt-12">
        {SYSTEMS.map((system, index) => (
          <article
            key={system.id}
            id={`system-${system.id}`}
            data-testid="system-card"
            className={cn(
              'stack-card relative mb-6 rounded-sm border p-6 md:p-10 lg:sticky',
              'group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12',
            )}
            style={
              {
                top: `calc(5rem + ${index * 0.75}rem)`,
                '--card': `var(--color-card-${(index % 3) + 1})`,
                zIndex: index + 1,
              } as CSSProperties
            }
          >
            <div data-reveal className={cn('min-w-0 lg:col-span-4', index % 2 === 1 && 'lg:order-2')}>
              <span className="label">{system.id}</span>
              <h3 className="mt-4 text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
                {system.title}
              </h3>
              <p className="mt-4 max-w-[52ch] text-muted">{system.summary}</p>
              <p className="mt-6 font-mono text-xs text-faint">{system.stack.join(' · ')}</p>
            </div>

            <div className={cn('stack-inset min-w-0 lg:col-span-8', index % 2 === 1 && 'lg:order-1')}>
              <SystemArchitecture systemId={system.id} />
            </div>
          </article>
        ))}
      </div>

      <Principles />
    </Section>
  )
}
