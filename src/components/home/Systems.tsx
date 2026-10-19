import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { SYSTEMS } from '@/lib/data'
import { cardVar } from '@/lib/cards'
import { STORIES } from '@/lib/stories'
import Section from '@/components/layout/Section'
import Principles from '@/components/home/Principles'
import StoryScene from '@/components/story/StoryScene'
import { cn } from '@/lib/utils'

const preload = () => {
  void import('@/pages/SystemPage')
}

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
              'stack-card sticky mb-6 rounded-sm border p-5 md:p-10',
              'top-[var(--top-sm)] lg:top-[var(--top-lg)]',
              'group grid gap-4 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-12',
            )}
            style={
              {
                '--top-sm': `calc(4.25rem + ${index * 0.6}rem)`,
                '--top-lg': `calc(5rem + ${index * 0.75}rem)`,
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
              <p className="mt-4 max-w-[52ch] text-muted line-clamp-3 md:line-clamp-none">{system.summary}</p>
              <p className="mt-6 hidden font-mono text-xs text-faint md:block">{system.stack.join(' · ')}</p>
              <Link
                to={`/systems/${system.slug}`}
                state={{ wipe: cardVar(index) }}
                data-testid="case-link"
                onPointerEnter={preload}
                onFocus={preload}
                className="mt-4 md:mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-sm text-ink underline underline-offset-4 hover:decoration-2"
              >
                Read the case study <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={cn('stack-inset min-w-0 lg:col-span-8', index % 2 === 1 && 'lg:order-1')}>
              <StoryScene storyId={system.id} />
              <p className="mt-3 hidden font-mono text-[11px] leading-relaxed text-muted md:block">{STORIES[system.id].caption}</p>
            </div>
            <span
              aria-hidden="true"
              data-stack-dim
              className="pointer-events-none absolute -inset-px rounded-sm bg-bg opacity-0"
            />
          </article>
        ))}
      </div>

      <Principles />
    </Section>
  )
}
