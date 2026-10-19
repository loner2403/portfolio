import { Link, useParams } from 'react-router-dom'
import { SYSTEMS } from '@/lib/data'
import { cardVar } from '@/lib/cards'
import { SITE_DESCRIPTION, truncate, useDocumentMeta } from '@/lib/seo'
import Container from '@/components/layout/Container'
import CaseBody from '@/components/case/CaseBody'
import SystemArchitecture from '@/components/home/SystemArchitecture'
import StoryScene from '@/components/story/StoryScene'
import NotFound from './NotFound'

const NAV = 'inline-flex min-h-11 items-center font-mono text-sm text-ink underline-offset-4 hover:underline'

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
          <h1 className="mt-4 max-w-5xl text-balance break-words hyphens-auto font-display text-[clamp(1.75rem,6.5vw,5.5rem)] font-extrabold leading-[1] text-ink">
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
        <CaseBody
          study={study}
          accent={accent}
          story={<StoryScene storyId={system.id} />}
          architecture={<SystemArchitecture systemId={system.id} />}
          note="Proprietary work. The approach and architecture are described; client data and code are not shown."
        />

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
