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

function Ref({ item }: { item: string }) {
  const { ids } = usage(item)
  if (ids.length === 0) return null
  return (
    <sup className="ml-1 font-mono text-[10px] text-faint">
      <span className="sr-only"> used in </span>
      {ids[0]}
      {ids.length > 1 ? ` +${ids.length - 1}` : ''}
    </sup>
  )
}

export default function Stack() {
  const [lead, ...rest] = RESUME_SKILL_GROUPS

  return (
    <Section id="stack" index="04" label="STACK" title="Tools I reach for">
      <div className="mt-10">
        <div data-reveal>
          <span className="label">{lead.label}</span>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {lead.items.map((item) => (
              <li key={item} className="text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug text-ink">
                {item}
                <Ref item={item} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {rest.map((group) => (
            <div key={group.label} data-reveal className="min-w-0">
              <span className="label">{group.label}</span>
              <ul className="mt-4">
                {group.items.map((item) => (
                  <li key={item} className="text-base leading-8 text-muted">
                    {item}
                    <Ref item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
