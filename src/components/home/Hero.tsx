import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { GENERAL_INFO, SYSTEMS } from '@/lib/data'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import HeroSheet from './HeroSheet'

const H1_CLASS =
  'mt-6 max-w-6xl text-[clamp(2.6rem,6vw,5.5rem)] font-medium leading-[.94] tracking-[-0.035em] text-ink'

const UNDERLINE = 'underline decoration-signal decoration-2 underline-offset-[6px]'

function Word({ i, underline, children }: { i: number; underline?: boolean; children: ReactNode }) {
  return (
    <span className="word-mask">
      <span className={cn('word', underline && UNDERLINE)} style={{ '--i': i } as CSSProperties}>
        {children}
      </span>
    </span>
  )
}

function HeroIndex({
  activeKey,
  onActive,
}: {
  activeKey: string | null
  onActive: (id: string | null) => void
}) {
  return (
    <nav aria-label="System index">
      <span className="label block">INDEX</span>
      <div className="mt-3">
        {SYSTEMS.map((system, index) => {
          const key = system.id.toLowerCase().replace('-', '')
          const isActive = activeKey === key
          return (
            <a
              key={system.id}
              href={`#system-${system.id}`}
              data-testid="index-row"
              onMouseEnter={() => onActive(key)}
              onMouseLeave={() => onActive(null)}
              onFocus={() => onActive(key)}
              onBlur={() => onActive(null)}
              className={cn(
                'group grid grid-cols-[3rem_1fr] gap-3 border-t border-line py-3 font-mono text-[13px]',
                index === SYSTEMS.length - 1 && 'border-b',
              )}
            >
              <span
                className={cn(
                  'text-faint group-hover:text-signal group-focus-visible:text-signal',
                  isActive && 'text-signal',
                )}
              >
                {system.id}
              </span>
              <span
                className={cn(
                  'text-muted group-hover:text-ink group-focus-visible:text-ink',
                  isActive && 'text-ink',
                )}
              >
                {system.title}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default function Hero() {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <section id="top" data-testid="hero" className="relative overflow-hidden">
      <Container className="relative">
        <div className="py-12 md:py-16">
          <span className="label block fade-up">
            HARSHAL LADE · SOFTWARE ENGINEER · AI &amp; DATA PLATFORMS · MUMBAI
          </span>
          <h1 className={H1_CLASS}>
            <Word i={0}>I</Word>{' '}
            <Word i={1}>build</Word>{' '}
            <Word i={2}>the</Word>{' '}
            <Word i={3} underline>
              agent
            </Word>
            <span className={UNDERLINE}> </span>
            <Word i={4} underline>
              &amp;
            </Word>
            <span className={UNDERLINE}> </span>
            <Word i={5} underline>
              data
            </Word>
            <span className={UNDERLINE}> </span>
            <Word i={6} underline>
              systems
            </Word>{' '}
            <Word i={7}>behind</Word>{' '}
            <Word i={8}>AI</Word>{' '}
            <Word i={9}>products.</Word>
          </h1>
          <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-10">
            <div className="flex min-w-0 flex-col lg:col-span-4 lg:h-full lg:justify-between">
              <div className="order-2 mt-10 lg:order-1 lg:mt-0">
                <HeroIndex activeKey={activeKey} onActive={setActiveKey} />
              </div>
              <div className="order-1 lg:order-2 lg:pt-8">
                <p
                  className="fade-up max-w-xl text-base text-muted md:text-lg"
                  style={{ animationDelay: '700ms' }}
                >
                  {GENERAL_INFO.heroLead}
                </p>
                <div
                  className="fade-up mt-8 flex flex-wrap items-center gap-3"
                  style={{ animationDelay: '850ms' }}
                >
                  <a
                    href="#systems"
                    className="inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-2.5 font-mono text-sm font-medium text-signal-ink transition-colors hover:bg-signal/90"
                  >
                    View systems →
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 font-mono text-sm text-ink underline-offset-4 transition-colors hover:text-signal hover:underline"
                  >
                    Get in touch →
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10 min-w-0 lg:col-span-8 lg:mt-0 lg:self-end">
              <HeroSheet activeId={activeKey} onActiveChange={setActiveKey} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
