import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import { PROJECTS, type ProjectType } from '@/lib/data'
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

function Gallery({ project }: { project: ProjectType }) {
  const images = project.images.filter(Boolean)
  const galleryImages = images.length > 0 ? images : project.longThumbnail ? [project.longThumbnail] : []

  if (galleryImages.length === 0) return null

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {galleryImages.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={`${project.title} screenshot ${index + 1}`}
          width={IMAGE_SIZES[src]?.w}
          height={IMAGE_SIZES[src]?.h}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-sm border border-line object-cover"
        />
      ))}
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
    <article data-testid="project-detail" className="pb-24 pt-12 md:pb-32 md:pt-24">
      <Container>
        <Link
          to="/#work"
          className="font-mono text-sm text-muted transition-colors hover:text-ink"
        >
          ← all work
        </Link>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.08em] text-faint">
          PROJECT · {project.year}
        </p>

        <h1 className="mt-4 max-w-4xl text-[clamp(2.6rem,6vw,5.5rem)] font-medium leading-[.95] tracking-[-0.035em] text-ink">
          {project.title}
        </h1>

        {project.role && (
          <div className="project-prose mt-6 max-w-3xl text-muted">
            {project.role.includes('<') ? parse(project.role) : project.role}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        {(project.liveUrl || project.sourceCode) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-2.5 font-mono text-sm font-medium text-signal-ink transition-colors hover:bg-signal/90"
              >
                Live ↗
              </a>
            )}
            {project.sourceCode && (
              <a
                href={project.sourceCode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal"
              >
                Source ↗
              </a>
            )}
          </div>
        )}

        <Description description={project.description} />
        <Gallery project={project} />

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
