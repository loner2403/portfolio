import { Link } from 'react-router-dom'
import { PROJECTS } from '@/lib/data'
import { SITE_DESCRIPTION, useDocumentMeta } from '@/lib/seo'
import Container from '@/components/layout/Container'

const LINK = 'inline-flex min-h-11 items-center font-mono text-sm text-ink underline underline-offset-4 hover:decoration-2'

export default function NotFound() {
  useDocumentMeta({
    title: '404 | Harshal Lade',
    description: SITE_DESCRIPTION,
    path: '/',
    noindex: true,
  })

  return (
    <section data-testid="not-found" className="tone-ink bg-card-3 py-24 md:py-36">
      <Container>
        <p className="label">404</p>
        <h1 className="mt-4 max-w-5xl text-balance font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-[0.95] text-ink">
          This page is not in the graph.
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg text-ink">
          The link may be old or mistyped. Try one of these instead.
        </p>
        <nav aria-label="Suggested pages" className="mt-10 flex flex-col items-start gap-1 border-t border-line pt-6">
          <Link to="/" className={LINK}>
            <span aria-hidden="true">←&nbsp;</span>Back home
          </Link>
          {PROJECTS.map((project) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} className={LINK}>
              {project.title}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  )
}
