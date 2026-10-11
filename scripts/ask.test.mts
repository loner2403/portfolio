import { test } from 'node:test'
import assert from 'node:assert/strict'
import { search, answer, KB } from '../src/lib/ask.ts'

const top = (q: string) => search(q, 3)[0]

test('knowledge base is built from site data and has the expected chunk ids', () => {
  const ids = new Set(KB.map((c) => c.id))
  for (const id of [
    'profile',
    'contact',
    'base',
    'open-to',
    'system-S-01',
    'system-S-02',
    'system-S-03',
    'system-S-04',
    'system-S-05',
    'exp-bull-ai',
    'exp-scale-ai',
    'exp-freelance',
    'exp-bnp-paribas',
    'project-thumbnail-ai',
    'project-medium-blog-clone',
    'project-resume-roaster',
  ]) {
    assert.ok(ids.has(id), `missing chunk ${id}`)
  }
  for (const chunk of KB) {
    assert.ok(chunk.title.length > 0 && chunk.text.length > 0, `empty chunk ${chunk.id}`)
    assert.ok(chunk.anchor.startsWith('#') || chunk.anchor.startsWith('/'), `bad anchor on ${chunk.id}`)
  }
})

test('retrieval finds the right place for typical visitor questions', () => {
  assert.ok(['system-S-01', 'system-S-04', 'focus-retrieval'].includes(top('how do you build rag retrieval over documents')?.id ?? ''))
  assert.equal(top('where are you based')?.id, 'base')
  assert.equal(top('how do I contact you or send an email')?.id, 'contact')
  assert.equal(top('tell me about resume roaster')?.id, 'project-resume-roaster')
  assert.equal(top('did you work with spring boot and camunda')?.id, 'exp-bnp-paribas')
  assert.ok(['system-S-03', 'principle-4', 'focus-pipelines'].includes(top('how do you handle checkpoints and scheduled ingestion')?.id ?? ''))
  assert.ok(
    ['system-S-02', 'principle-2', 'principle-5', 'focus-evaluation'].includes(
      top('how do you test prompts with contract tests and evaluation')?.id ?? '',
    ),
  )
})

test('questions outside the site content return no match instead of a guess', () => {
  assert.deepEqual(search('what is the airspeed velocity of an unladen swallow'), [])
  assert.deepEqual(search('who won the football world cup'), [])
  assert.deepEqual(search('   '), [])
})

test('answers are grounded: they carry sources and flag no-match honestly', () => {
  const hit = answer('where are you based')
  assert.equal(hit.grounded, true)
  assert.ok(hit.sources.length >= 1 && hit.sources.every((s) => s.anchor.length > 0))
  assert.ok(hit.text.length > 0)

  const miss = answer('what is the capital of france')
  assert.equal(miss.grounded, false)
  assert.equal(miss.sources.length, 0)
  assert.ok(miss.text.length > 0)
  assert.ok(Array.isArray(miss.suggestions) && miss.suggestions.length >= 3)
})

test('privacy: the knowledge base never contains a phone number or an old email', () => {
  const all = KB.map((c) => `${c.title} ${c.text}`).join(' ')
  assert.ok(!/7083|\+91/.test(all), 'phone number leaked into the knowledge base')
  assert.ok(!/gmail|harshal03/.test(all), 'old email leaked into the knowledge base')
})

test('search is deterministic and returns at most topK sorted results', () => {
  const a = search('python fastapi react', 3)
  const b = search('python fastapi react', 3)
  assert.deepEqual(a, b)
  assert.ok(a.length <= 3)
  for (let i = 1; i < a.length; i += 1) assert.ok(a[i - 1].score >= a[i].score)
})
