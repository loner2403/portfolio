import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import { PROJECTS, type ProjectType } from '@/lib/data'
import { cardVar } from '@/lib/cards'
import { IMAGE_SIZES } from '@/lib/image-sizes'
import { SITE_DESCRIPTION, truncate, useDocumentMeta } from '@/lib/seo'
import Container from '@/components/layout/Container'
import NotFound from './NotFound'

function renderPlainText(text: string): ReactNode[] {
  return text
    .split(/\n\s*\n/)
    .filter((block) => block.trim())
    .map((block, blockIndex) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      if (lines.length > 0 && lines.every((line) => line.startsWith('-'))) {
        return (
          <ul key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{line.replace(/^-\s*/, '')}</li>
            ))}
          </ul>
        )
      }

      return <p key={blockIndex}>{lines.join(' ')}</p>
    })
}

function Description({ description }: { description: string }) {
  const content = description.includes('<')
    ? parse(description)
    : renderPlainText(description)
  return <div className="project-prose mt-8">{content}</div>
}

function Visual({ project }: { project: ProjectType }) {
  const images = project.images.filter(Boolean)
  const sources =
    images.length > 0
      ? images
      : project.longThumbnail
        ? [project.longThumbnail]
        : project.thumbnail
          ? [project.thumbnail]
          : []

  return (
    <div data-testid="project-visual" className="mt-12">
      {sources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {sources.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${project.title} screenshot ${index + 1}`}
              width={IMAGE_SIZES[src]?.w}
              height={IMAGE_SIZES[src]?.h}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] h-auto w-full rounded-sm border border-line object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="border border-line p-8">
          <span className="label">BUILT WITH</span>
          <ul className="mt-4 space-y-1">
            {project.techStack.map((tech) => (
              <li key={tech} className="font-mono text-[clamp(1.25rem,3vw,2rem)] text-ink">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function toPlainText(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = PROJECTS.find((item) => item.slug === slug)

  const meta = project
    ? {
        title: `${project.title} | Harshal Lade`,
        description: truncate(toPlainText(project.description), 155),
        path: `/projects/${project.slug}`,
      }
    : {
        title: '404 | Harshal Lade',
        description: SITE_DESCRIPTION,
        path: '/',
        noindex: true,
      }

  useDocumentMeta(meta)

  if (!project) return <NotFound />

  const currentIndex = PROJECTS.findIndex((item) => item.slug === project.slug)
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length]

  return (
    <article data-testid="project-detail" className="pb-24 md:pb-32">
      <header
        data-testid="project-header"
        className="tone-ink py-14 md:py-24"
        style={{ background: cardVar(currentIndex) }}
      >
        <Container>
          <Link
            to="/#work"
            className="inline-flex min-h-11 items-center font-mono text-sm text-ink underline-offset-4 hover:underline"
          >
            ← all work
          </Link>

          <p className="label mt-6">PROJECT · {project.year}</p>

          <h1 className="mt-4 max-w-5xl text-balance font-display text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.95] text-ink">
            {project.title}
          </h1>

          {project.role && (
            <div className="mt-6 max-w-3xl text-ink">
              {project.role.includes('<') ? parse(project.role) : project.role}
            </div>
          )}
        </Container>
      </header>

      <Container>
        <p className="mt-10 font-mono text-sm text-muted">{project.techStack.join(', ')}</p>

        {project.liveUrl || project.sourceCode ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-signal px-5 py-2.5 font-mono text-sm font-medium text-signal-ink transition-colors hover:bg-signal/90"
              >
                Live ↗
              </a>
            )}
            {project.sourceCode && (
              <a
                href={project.sourceCode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal"
              >
                Source ↗
              </a>
            )}
          </div>
        ) : (
          <p className="mt-6 font-mono text-sm text-muted">Private codebase, not public</p>
        )}

        <Description description={project.description} />
        <Visual project={project} />

        <div className="mt-16 border-t border-line pt-6">
          <Link
            to={`/projects/${nextProject.slug}`}
            className="inline-flex items-center gap-2 font-mono text-sm text-ink transition-colors hover:text-signal"
          >
            Next project →
          </Link>
        </div>
      </Container>
    </article>
  )
}
