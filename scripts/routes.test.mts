import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PROJECTS, SYSTEMS } from '../src/lib/data.ts'

const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as {
  rewrites: { source: string; destination: string }[]
}
const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')

function rewriteCovers(path: string): boolean {
  return vercel.rewrites.some((rule) => {
    const match = rule.source.match(/^\/(\w+)\/:slug\(([^)]+)\)$/)
    if (!match) return rule.source === path
    const [, prefix, slugs] = match
    return slugs.split('|').some((slug) => `/${prefix}/${slug}` === path)
  })
}

test('system slugs are unique, lowercase and url safe', () => {
  const slugs = SYSTEMS.map((system) => system.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
})

test('every system and project route has a vercel rewrite', () => {
  for (const system of SYSTEMS) assert.ok(rewriteCovers(`/systems/${system.slug}`), system.slug)
  for (const project of PROJECTS) assert.ok(rewriteCovers(`/projects/${project.slug}`), project.slug)
})

test('every system and project route is in the sitemap', () => {
  for (const system of SYSTEMS) {
    assert.ok(sitemap.includes(`https://harshallade.site/systems/${system.slug}</loc>`), system.slug)
  }
  for (const project of PROJECTS) {
    assert.ok(sitemap.includes(`https://harshallade.site/projects/${project.slug}</loc>`), project.slug)
  }
})

test('case studies have content and no invented-looking empty results', () => {
  for (const system of SYSTEMS) {
    const study = system.caseStudy
    assert.ok(study.problem.length > 60, `${system.id} problem`)
    assert.ok(study.built.length >= 3, `${system.id} built`)
    assert.ok(study.decisions.length >= 2, `${system.id} decisions`)
    for (const result of study.results) {
      assert.ok(result.value.trim() && result.label.trim() && result.note.trim(), `${system.id} result`)
    }
  }
})

test('case study copy has no em or en dashes', () => {
  const text = JSON.stringify(SYSTEMS.map((system) => system.caseStudy))
  assert.ok(!/[–—]/.test(text))
})
