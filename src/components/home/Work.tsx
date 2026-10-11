import { Link } from 'react-router-dom'
import { PROJECTS, type ProjectType } from '@/lib/data'
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
      className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-b border-line py-5 transition-colors hover:bg-panel focus-visible:bg-panel md:grid-cols-[2.5rem_minmax(0,1fr)_3.5rem_minmax(0,7rem)] md:items-center md:gap-6 lg:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,16rem)_3.5rem_minmax(0,7rem)]"
    >
      <span className="font-mono text-xs text-faint md:text-sm">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="min-w-0 text-xl font-medium text-ink md:truncate md:text-[clamp(1.75rem,3.9vw,3.5rem)] md:leading-[1.05] md:tracking-[-0.02em]">
        {project.title}
      </span>

      <span className="hidden min-w-0 truncate font-mono text-xs text-muted lg:block">
        {project.techStack.slice(0, 3).join(' · ')}
      </span>

      <span className="col-start-2 row-start-2 flex items-center gap-2 md:contents">
        <span className="font-mono text-xs text-muted md:text-sm">
          {project.year}
        </span>
        <span className="font-mono text-xs text-faint md:hidden" aria-hidden="true">
          ·
        </span>
        <span
          className={`whitespace-nowrap font-mono text-xs ${proof.includes('live') ? 'text-signal' : 'text-muted'}`}
        >
          {proof}
          <span
            className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
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
          className="pointer-events-none absolute right-6 top-1/2 z-10 hidden h-[150px] w-[240px] -translate-y-1/2 overflow-hidden rounded-sm border border-line opacity-0 transition-opacity duration-300 [@media(hover:hover)]:block group-hover:opacity-100 group-focus-visible:opacity-100"
        >
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
