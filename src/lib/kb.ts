import {
  CONTACT_FACTS,
  FOCUS_AREAS,
  GENERAL_INFO,
  HERO_STATS,
  MY_EXPERIENCE,
  PRINCIPLES,
  PROJECTS,
  RESUME_SKILL_GROUPS,
  SOCIAL_LINKS,
  SYSTEMS,
} from './data.ts'
import { EXTRA_KB } from './kb-extra.ts'

export interface Chunk {
  id: string
  title: string
  text: string
  anchor: string
}

function sentence(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length === 0) return ''
  return /[.!?]$/.test(clean) ? clean : `${clean}.`
}

function join(parts: string[]): string {
  return parts
    .map(sentence)
    .filter((part) => part.length > 0)
    .join(' ')
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function plain(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function fact(label: string): string {
  return CONTACT_FACTS.find((item) => item.label === label)?.value ?? ''
}

function link(name: string): string {
  return SOCIAL_LINKS.find((item) => item.name === name)?.url ?? ''
}

function systemAnchor(seen: string[]): string {
  return seen[0] ? `#system-${seen[0]}` : '#systems'
}

const profileChunk: Chunk = {
  id: 'profile',
  title: `About ${GENERAL_INFO.name}`,
  text: join([GENERAL_INFO.role, ...GENERAL_INFO.about]),
  anchor: '#top',
}

const contactChunk: Chunk = {
  id: 'contact',
  title: 'Contact',
  text: join([
    `Email ${GENERAL_INFO.email}`,
    `GitHub ${link('github')}`,
    `LinkedIn ${link('linkedin')}`,
    'Reach out about AI and data platform roles',
  ]),
  anchor: '#contact',
}

const baseChunk: Chunk = {
  id: 'base',
  title: `Where ${GENERAL_INFO.firstName} is based`,
  text: join([`Based in ${fact('BASE')}`, `Open to work in ${fact('LOCATIONS')}`]),
  anchor: '#contact',
}

const openToChunk: Chunk = {
  id: 'open-to',
  title: `What ${GENERAL_INFO.firstName} is open to`,
  text: join([`Open to ${fact('OPEN TO')}`]),
  anchor: '#contact',
}

const metricsChunk: Chunk = {
  id: 'metrics',
  title: 'Numbers',
  text: join(HERO_STATS.map((stat) => `${stat.value}${stat.suffix} ${stat.label} (${stat.source})`)),
  anchor: '#top',
}

const systemChunks: Chunk[] = SYSTEMS.map((system) => ({
  id: `system-${system.id}`,
  title: `${system.id} ${system.title}`,
  text: join([
    system.summary,
    system.caseStudy.tldr,
    system.stages?.length ? `Stages: ${system.stages.join(' then ')}` : '',
    ...system.highlights,
    system.caseStudy.problem,
    ...system.caseStudy.built,
    ...system.caseStudy.decisions.map((d) => `${d.title}: ${d.body}`),
    ...system.caseStudy.results.map((r) => `${r.value} ${r.label}, ${r.note}`),
    `Stack: ${system.stack.join(', ')}`,
  ]),
  anchor: `/systems/${system.slug}`,
}))

const principleChunks: Chunk[] = PRINCIPLES.map((principle, index) => ({
  id: `principle-${index + 1}`,
  title: principle.title,
  text: join([principle.line]),
  anchor: systemAnchor(principle.seen),
}))

const focusChunks: Chunk[] = FOCUS_AREAS.map((area) => ({
  id: `focus-${area.id}`,
  title: area.title,
  text: join([area.line]),
  anchor: area.href ?? systemAnchor(area.seen),
}))

const experienceChunks: Chunk[] = MY_EXPERIENCE.map((entry) => ({
  id: `exp-${slugify(entry.company)}`,
  title: `${entry.company}: ${entry.title}`,
  text: join([
    entry.duration,
    entry.location ?? '',
    ...(entry.points ?? []),
    entry.skills?.length ? `Skills: ${entry.skills.join(', ')}` : '',
  ]),
  anchor: '#log',
}))

const projectChunks: Chunk[] = PROJECTS.map((project) => ({
  id: `project-${project.slug}`,
  title: project.title,
  text: join([
    `Year ${project.year}`,
    plain(project.description),
    project.role ? plain(project.role) : '',
    `Tech: ${project.techStack.join(', ')}`,
    project.liveUrl ? `Live site: ${project.liveUrl}` : '',
    ...(project.caseStudy
      ? [
          project.caseStudy.tldr,
          project.caseStudy.problem,
          ...project.caseStudy.built,
          ...project.caseStudy.decisions.map((d) => `${d.title}: ${d.body}`),
          ...project.caseStudy.results.map((r) => `${r.value} ${r.label}, ${r.note}`),
        ]
      : []),
  ]),
  anchor: `/projects/${project.slug}`,
}))

const skillChunks: Chunk[] = RESUME_SKILL_GROUPS.map((group) => ({
  id: `skills-${slugify(group.label)}`,
  title: group.label,
  text: join([`Skills: ${group.items.join(', ')}`]),
  anchor: '#stack',
}))

export const KB: Chunk[] = [
  profileChunk,
  contactChunk,
  baseChunk,
  openToChunk,
  metricsChunk,
  ...systemChunks,
  ...principleChunks,
  ...focusChunks,
  ...experienceChunks,
  ...projectChunks,
  ...skillChunks,
  ...EXTRA_KB,
]
