import { test } from 'node:test'
import assert from 'node:assert/strict'
import { KB, search } from '../src/lib/ask.ts'
import { PROJECTS, SYSTEMS } from '../src/lib/data.ts'

test('system chunks carry the case study and link to the case page', () => {
  for (const system of SYSTEMS) {
    const chunk = KB.find((c) => c.id === `system-${system.id}`)
    assert.ok(chunk, system.id)
    assert.equal(chunk.anchor, `/systems/${system.slug}`)
    assert.ok(chunk.text.includes(system.caseStudy.tldr.replace(/\s+/g, ' ').trim().replace(/\.$/, '')), `${system.id} tldr`)
    for (const result of system.caseStudy.results) assert.ok(chunk.text.includes(result.value), `${system.id} ${result.value}`)
  }
})

test('project chunks carry their case study when there is one', () => {
  for (const project of PROJECTS.filter((p) => p.caseStudy)) {
    const chunk = KB.find((c) => c.anchor === `/projects/${project.slug}`)
    assert.ok(chunk, project.slug)
    assert.ok(chunk.text.includes(project.caseStudy!.problem.slice(0, 40)), `${project.slug} problem`)
  }
})

test('case questions find the right chunk', () => {
  assert.equal(search('how accurate is the extraction pipeline', 3)[0]?.id, 'system-S-02')
  assert.ok(search('offline meeting transcription in hindi', 3).some((c) => c.anchor === '/projects/meeting-assistant'))
  assert.ok(search('small shop bills hackathon', 3).some((c) => c.anchor === '/projects/vyapardrishti'))
})
