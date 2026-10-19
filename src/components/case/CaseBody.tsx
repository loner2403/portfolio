import type { ReactNode } from 'react'
import type { CaseStudy } from '@/lib/data'
import { cn } from '@/lib/utils'

const SECTION = 'border-t border-line py-14 md:py-20 lg:grid lg:grid-cols-12 lg:gap-12'
const HEAD = 'lg:col-span-4 lg:sticky lg:top-24 lg:self-start'
const BODY = 'mt-8 min-w-0 lg:col-span-8 lg:mt-0'

const RESULT_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

function Heading({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className={HEAD}>
      <span className="label">{n}</span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.05] text-ink">{children}</h2>
    </div>
  )
}

const FLAME = 'var(--color-flame)'
const pad = (n: number) => String(n).padStart(2, '0')

export default function CaseBody({
  study,
  accent,
  architecture,
  story,
  note,
}: {
  study: CaseStudy
  accent: string
  architecture?: ReactNode
  story?: ReactNode
  note?: string
}) {
  const tldrColor = accent === 'var(--color-card-2)' ? FLAME : accent
  let counter = 3
  const storyNo = story ? pad(counter++) : ''
  const archNo = architecture ? pad(counter++) : ''
  const decisionsNo = pad(counter)

  return (
    <>
      <section data-testid="case-tldr" className="py-12 md:py-16">
        <p className="label">TL;DR</p>
        <p
          className="mt-4 max-w-[34em] border-l-4 pl-5 text-xl leading-[1.4] text-ink sm:text-2xl md:text-3xl md:leading-[1.35]"
          style={{ borderColor: tldrColor }}
        >
          {study.tldr}
        </p>
      </section>

      {study.results.length > 0 && (
        <section
          data-testid="case-results"
          className={cn(
            'grid gap-px border border-line bg-line',
            RESULT_COLS[study.results.length] ?? 'grid-cols-2 lg:grid-cols-4',
          )}
        >
          {study.results.map((result, i) => (
            <div key={i} data-testid="case-result" className="flex flex-col bg-bg p-5 md:p-8">
              <span
                className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-none tabular-nums"
                style={{ color: FLAME }}
              >
                {result.value}
              </span>
              <span className="label mt-3">{result.label}</span>
              <span className="mt-2 font-mono text-xs text-muted">{result.note}</span>
            </div>
          ))}
        </section>
      )}

      <section data-testid="case-problem" className={SECTION}>
        <Heading n="01">The problem</Heading>
        <p className={`${BODY} max-w-[34em] text-xl leading-[1.6] text-ink md:text-[1.375rem]`}>
          {study.problem}
        </p>
      </section>

      <section data-testid="case-built" className={SECTION}>
        <Heading n="02">What I built</Heading>
        <ol className={BODY}>
          {study.built.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-line py-6 last:border-b-0"
            >
              <span
                className="font-display text-3xl leading-none tabular-nums"
                style={{ color: FLAME }}
              >
                {pad(i + 1)}
              </span>
              <span className="max-w-[36em] text-lg leading-[1.7] text-ink">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {story && (
        <section data-testid="case-story" className={SECTION}>
          <Heading n={storyNo}>How it works</Heading>
          <div className={`${BODY} border border-line bg-[#F8F6F1] p-4`}>{story}</div>
        </section>
      )}

      {architecture && (
        <section data-testid="case-architecture" className={SECTION}>
          <Heading n={archNo}>Architecture</Heading>
          <div className={`${BODY} overflow-x-auto border border-line bg-panel p-4`}>{architecture}</div>
        </section>
      )}

      <section className={SECTION}>
        <Heading n={decisionsNo}>Decisions that mattered</Heading>
        <div className={`${BODY} grid gap-10`}>
          {study.decisions.map((d, i) => (
            <div
              key={i}
              data-testid="case-decision"
              className="border-t-2 pt-5"
              style={{ borderColor: FLAME }}
            >
              <h3 className="text-xl font-medium text-ink">{d.title}</h3>
              <p className="mt-3 max-w-[36em] text-base leading-[1.7] text-muted">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {note && <p className="border-t border-line pt-6 font-mono text-xs text-faint">{note}</p>}
    </>
  )
}
