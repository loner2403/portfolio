import { KB } from './kb.ts'
import type { Chunk } from './kb.ts'
import { buildIndex, score, tokenize } from './bm25.ts'

export { KB } from './kb.ts'

const MIN_SCORE = 3.5
const SECOND_HIT_RATIO = 0.7
const OUT_OF_SCOPE =
  'That is outside what I know about this site. Ask about the systems, the work, the stack or how to get in touch.'
const SUGGESTIONS = [
  'What systems have you built?',
  'What is your stack?',
  'Where are you based?',
  'Tell me about your projects',
  'How can I contact you?',
]

const CHUNKS_BY_ID = new Map<string, Chunk>(KB.map((chunk): [string, Chunk] => [chunk.id, chunk]))
const INDEX = buildIndex(KB.map((chunk) => ({ id: chunk.id, text: `${chunk.title} ${chunk.title} ${chunk.text}` })))

export interface Hit {
  id: string
  title: string
  text: string
  anchor: string
  score: number
  matched: string[]
}

export function search(query: string, topK = 3): Hit[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []
  const ranked = score(INDEX, tokens)
  if (ranked.length === 0 || ranked[0].score < MIN_SCORE) return []
  const hits: Hit[] = []
  for (const result of ranked) {
    if (hits.length >= topK) break
    const chunk = CHUNKS_BY_ID.get(result.id)
    if (!chunk) continue
    hits.push({
      id: chunk.id,
      title: chunk.title,
      text: chunk.text,
      anchor: chunk.anchor,
      score: result.score,
      matched: result.matched,
    })
  }
  return hits
}

export interface Answer {
  text: string
  grounded: boolean
  sources: { id: string; title: string; anchor: string; score: number }[]
  suggestions: string[]
  matched: string[]
}

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/)
}

function leadingSentences(text: string, count: number): string {
  return sentences(text).slice(0, count).join(' ')
}

export function answer(query: string): Answer {
  const hits = search(query, 3)
  if (hits.length === 0) {
    return {
      text: OUT_OF_SCOPE,
      grounded: false,
      sources: [],
      suggestions: [...SUGGESTIONS],
      matched: [],
    }
  }
  const [top, second] = hits
  const parts = [leadingSentences(top.text, 2)]
  if (second && second.score >= top.score * SECOND_HIT_RATIO) {
    parts.push(leadingSentences(second.text, 1))
  }
  return {
    text: parts.join(' '),
    grounded: true,
    sources: hits.map((hit) => ({ id: hit.id, title: hit.title, anchor: hit.anchor, score: hit.score })),
    suggestions: [],
    matched: top.matched,
  }
}
