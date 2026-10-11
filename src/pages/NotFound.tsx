import { Link } from 'react-router-dom'
import { SITE_DESCRIPTION, useDocumentMeta } from '@/lib/seo'
import Container from '@/components/layout/Container'

export default function NotFound() {
  useDocumentMeta({
    title: '404 | Harshal Lade',
    description: SITE_DESCRIPTION,
    path: '/',
    noindex: true,
  })

  return (
    <section data-testid="not-found" className="py-32 md:py-48">
      <Container>
        <p className="font-mono text-sm text-muted">404 · node not found in graph</p>
        <Link
          to="/"
          className="mt-6 inline-block font-mono text-sm text-signal underline underline-offset-4"
        >
          ← back home
        </Link>
      </Container>
    </section>
  )
}
