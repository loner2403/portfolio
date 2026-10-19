import { Link } from 'react-router-dom'
import { PROJECTS, type ProjectType } from '@/lib/data'
import { cardBg } from '@/lib/cards'
import { cn } from '@/lib/utils'
import Section from '@/components/layout/Section'

function WorkRow({ project, index }: { project: ProjectType; index: number }) {
  const proof = project.liveUrl && project.sourceCode
    ? 'live · source'
    : project.liveUrl
      ? 'live'
      : project.sourceCode
        ? 'source'
        : 'not public'

  return (
    <Link
      to={`/projects/${project.slug}`}
      data-testid="work-row"
      data-reveal
      className="work-row group relative isolate grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 overflow-hidden border-b border-line py-5 active:bg-panel focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-signal-ink md:grid-cols-[2.5rem_minmax(0,1fr)_3.5rem_minmax(0,7rem)] md:items-center md:gap-6 lg:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,16rem)_3.5rem_minmax(0,7rem)]"
    >
      <span data-work-fill aria-hidden="true" className={cn('absolute inset-0 -z-10', cardBg(index))} />
      <span className="work-text font-mono text-xs text-faint md:text-sm">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="work-text min-w-0 text-xl font-medium text-ink md:line-clamp-2 md:text-[clamp(1.75rem,3.9vw,3.5rem)] md:leading-[1.05] md:tracking-[-0.02em]">
        {project.title}
      </span>

      <span className="work-text hidden min-w-0 truncate font-mono text-xs text-muted lg:block">
        {project.techStack.slice(0, 3).join(' · ')}
      </span>

      <span className="col-start-2 row-start-2 flex items-center gap-2 md:contents">
        <span className="work-text font-mono text-xs text-muted md:text-sm">
          {project.year}
        </span>
        <span className="work-text font-mono text-xs text-faint md:hidden" aria-hidden="true">
          ·
        </span>
        <span
          className={`work-text whitespace-nowrap font-mono text-xs ${proof.includes('live') ? 'work-live text-signal' : 'text-muted'}`}
        >
          {proof}
          <span
            className="work-text ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
            aria-hidden="true"
          >
            ↗
          </span>
        </span>
      </span>

      {project.thumbnail && (
        <span
          aria-hidden="true"
          data-work-preview
          className="pointer-events-none absolute right-6 top-1/2 z-10 hidden h-[150px] w-[240px] -translate-y-1/2 overflow-hidden rounded-sm border border-signal-ink opacity-0 transition-opacity duration-300 [@media(hover:hover)]:block group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span className="absolute left-0 top-0 bg-bg px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
            OPEN
          </span>
          <img
            src={project.thumbnail}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </span>
      )}
    </Link>
  )
}

export default function Work() {
  return (
    <Section id="work" index="02" label="WORK" title="Selected work">
      <div className="mt-10 border-t border-line">
        {PROJECTS.map((project, index) => (
          <WorkRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
