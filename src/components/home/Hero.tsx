import type { CSSProperties, ReactNode } from 'react'
import { GENERAL_INFO } from '@/lib/data'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import HeroSheet from './HeroSheet'

const H1_CLASS =
  'max-w-3xl text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink'

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

export default function Hero() {
  return (
    <section id="top" data-testid="hero" className="relative overflow-hidden">
      <Container className="relative">
        <div className="py-10 md:py-14">
          <span className="label block fade-up">
            HARSHAL LADE · SOFTWARE ENGINEER · AI &amp; DATA PLATFORMS · MUMBAI
          </span>
          <p
            aria-hidden="true"
            className="mt-6 select-none font-display font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(2.75rem,8.6vw,8.25rem)] text-ink"
          >
            <span className="line-mask">
              <span className="line-up" style={{ animationDelay: '0ms' }}>
                {GENERAL_INFO.firstName}
              </span>
            </span>
            <span className="line-mask pl-[10vw] text-flame">
              <span className="line-up" style={{ animationDelay: '90ms' }}>
                {GENERAL_INFO.lastName}
              </span>
            </span>
          </p>
          <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
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
            </div>
            <div className="mt-6 lg:col-span-5 lg:mt-0">
              <p
                className="rise max-w-[56ch] text-base text-muted md:text-lg"
                style={{ animationDelay: '280ms' }}
              >
                {GENERAL_INFO.heroLead}
              </p>
              <div
                className="rise mt-6 flex flex-wrap items-center gap-3"
                style={{ animationDelay: '360ms' }}
              >
                <a
                  href="#systems"
                  className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-signal px-5 py-2.5 font-mono text-sm font-medium text-signal-ink transition-colors hover:bg-signal/90"
                >
                  View systems →
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-12 items-center gap-2 font-mono text-sm text-ink underline-offset-4 transition-colors hover:text-signal hover:underline"
                >
                  Get in touch →
                </a>
              </div>
            </div>
          </div>
          <div className="mt-14 min-w-0 md:mt-16">
            <HeroSheet />
          </div>
        </div>
      </Container>
    </section>
  )
}
