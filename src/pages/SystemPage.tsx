import { Link, useParams } from 'react-router-dom'
import { SYSTEMS } from '@/lib/data'
import { cardVar } from '@/lib/cards'
import { cn } from '@/lib/utils'
import { SITE_DESCRIPTION, truncate, useDocumentMeta } from '@/lib/seo'
import Container from '@/components/layout/Container'
import SystemArchitecture from '@/components/home/SystemArchitecture'
import NotFound from './NotFound'

const SECTION = 'border-t border-line py-12 md:py-16 lg:grid lg:grid-cols-12 lg:gap-10'
const SECTION_LABEL = 'label lg:col-span-3'
const SECTION_BODY = 'mt-6 min-w-0 lg:col-span-9 lg:mt-0'
const NAV = 'inline-flex min-h-11 items-center font-mono text-sm text-ink underline-offset-4 hover:underline'

const RESULT_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

export default function SystemPage() {
  const { slug } = useParams()
  const index = SYSTEMS.findIndex((s) => s.slug === slug)
  const system = index === -1 ? undefined : SYSTEMS[index]

  const meta = system
    ? {
        title: `${system.title} | Harshal Lade`,
        description: truncate(system.summary, 155),
        path: `/systems/${system.slug}`,
      }
    : {
        title: '404 | Harshal Lade',
        description: SITE_DESCRIPTION,
        path: '/',
        noindex: true,
      }

  useDocumentMeta(meta)

  if (!system) return <NotFound />

  const study = system.caseStudy
  const next = SYSTEMS[(index + 1) % SYSTEMS.length]
  const prev = SYSTEMS[(index - 1 + SYSTEMS.length) % SYSTEMS.length]
  const accent = cardVar(index)

  return (
    <article data-testid="system-case" className="pb-24 md:pb-32">
      <header
        data-testid="case-header"
        className="tone-ink py-14 md:py-24"
        style={{ background: accent }}
      >
        <Container>
          <Link to="/#systems" className={NAV}>
            <span aria-hidden="true">←&nbsp;</span>All systems
          </Link>
          <p className="label mt-6">{system.id} · CASE STUDY</p>
          <h1 className="mt-4 max-w-5xl text-balance font-display text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.95] text-ink">
            {system.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-ink">{system.summary}</p>
          <p className="mt-6 font-mono text-xs text-ink">
            {study.period} / {study.role}
          </p>
          <p className="mt-1 font-mono text-xs text-ink">{system.stack.join(', ')}</p>
        </Container>
      </header>

      <Container>
        {study.results.length > 0 && (
          <section
            data-testid="case-results"
            className={cn('grid gap-px border-x border-b border-line bg-line', RESULT_COLS[study.results.length] ?? 'grid-cols-2 lg:grid-cols-4')}
          >
            {study.results.map((result, i) => (
              <div key={i} data-testid="case-result" className="flex flex-col bg-bg p-5 md:p-8">
                <span
                  className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-none tabular-nums"
                  style={{ color: accent }}
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
          <h2 className={SECTION_LABEL}>THE PROBLEM</h2>
          <p className={`${SECTION_BODY} max-w-[60ch] text-xl leading-relaxed text-ink`}>
            {study.problem}
          </p>
        </section>

        <section data-testid="case-built" className={SECTION}>
          <h2 className={SECTION_LABEL}>WHAT I BUILT</h2>
          <ol className={SECTION_BODY}>
            {study.built.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-line py-5 last:border-b-0"
              >
                <span
                  className="font-display text-3xl leading-none tabular-nums"
                  style={{ color: accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-base leading-relaxed text-ink md:text-lg">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section data-testid="case-architecture" className={SECTION}>
          <h2 className={SECTION_LABEL}>ARCHITECTURE</h2>
          <div className={`${SECTION_BODY} overflow-x-auto border border-line bg-panel p-4`}>
            <SystemArchitecture systemId={system.id} />
          </div>
        </section>

        <section className={SECTION}>
          <h2 className={SECTION_LABEL}>DECISIONS THAT MATTERED</h2>
          <div className={`${SECTION_BODY} grid gap-6 md:grid-cols-2`}>
            {study.decisions.map((d, i) => (
              <div
                key={i}
                data-testid="case-decision"
                className="border-t-2 pt-4"
                style={{ borderColor: accent }}
              >
                <h3 className="text-lg font-medium text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="border-t border-line pt-6 font-mono text-xs text-faint">
          Proprietary work. The approach and architecture are described; client data and code are not shown.
        </p>

        <nav
          aria-label="More systems"
          className="mt-12 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:justify-between"
        >
          <Link to={`/systems/${prev.slug}`} className={NAV}>
            <span aria-hidden="true">←&nbsp;</span>{prev.title}
          </Link>
          <Link data-testid="case-next" to={`/systems/${next.slug}`} className={NAV}>
            Next: {next.title}<span aria-hidden="true">&nbsp;→</span>
          </Link>
        </nav>
      </Container>
    </article>
  )
}
