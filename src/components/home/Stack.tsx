import { PROJECTS, RESUME_SKILL_GROUPS, SYSTEMS } from '@/lib/data'
import Section from '@/components/layout/Section'

function usage(item: string): { ids: string[]; titles: string[] } {
  const tokens = item
    .toLowerCase()
    .trim()
    .split('/')
    .map((token) => token.trim())
  const ids = SYSTEMS.filter((system) =>
    system.stack.some((entry) => tokens.includes(entry.toLowerCase())),
  ).map((system) => system.id)
  const titles = PROJECTS.filter((project) =>
    project.techStack.some((entry) => tokens.includes(entry.toLowerCase())),
  ).map((project) => project.title)
  return { ids, titles }
}

export default function Stack() {
  return (
    <Section id="stack" index="04" label="STACK" title="Tools I reach for">
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {RESUME_SKILL_GROUPS.map((group) => {
          const entries = group.items.map((item) => ({ item, matches: usage(item) }))
          const used = entries.filter(({ matches }) => matches.ids.length + matches.titles.length > 0)
          const unused = entries.filter(({ matches }) => matches.ids.length + matches.titles.length === 0)

          return (
            <div key={group.label} data-reveal className="rounded-sm border border-line bg-panel p-6">
              <span className="label">{group.label}</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {used.map(({ item, matches }) => {
                  const refs = [...matches.ids, ...matches.titles]
                  const shown = matches.ids.slice(0, 2)
                  const more = matches.ids.length - shown.length
                  const suffix = matches.ids.length > 0
                    ? `${shown.join(' ')}${more > 0 ? ` +${more}` : ''}`
                    : `×${matches.titles.length}`
                  return (
                    <span
                      key={item}
                      title={`used in ${refs.join(', ')}`}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted"
                    >
                      <span className="h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                      <span>{item}</span>
                      <span className="whitespace-nowrap text-faint">{suffix}</span>
                    </span>
                  )
                })}
              </div>
              {unused.length > 0 && (
                <p className="mt-3 font-mono text-xs text-muted">
                  also: {unused.map(({ item }) => item).join(', ')}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
