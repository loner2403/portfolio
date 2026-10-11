const K1 = 1.4
const B = 0.75

const STOPWORDS = new Set([
  'a', 'about', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'could',
  'did', 'do', 'does', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'how', 'i', 'if', 'in', 'is',
  'it', 'its', 'just', 'know', 'like', 'make', 'me', 'more', 'much', 'my', 'need', 'of', 'on', 'or', 'our',
  'out', 'please', 'really', 'show', 'so', 'some', 'tell', 'that', 'the', 'their', 'them', 'there', 'thing',
  'think', 'these', 'they', 'this', 'to', 'us', 'want', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
])

function stem(word: string): string {
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3)
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

export function tokenize(text: string): string[] {
  const tokens: string[] = []
  for (const part of text.toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    if (part.length === 0 || STOPWORDS.has(part)) continue
    const token = stem(part)
    if (token.length > 0) tokens.push(token)
  }
  return tokens
}

export interface IndexedDoc {
  id: string
  length: number
  termFreqs: Map<string, number>
}

export interface Index {
  docs: IndexedDoc[]
  docFreqs: Map<string, number>
  avgLength: number
}

export interface Scored {
  id: string
  score: number
  matched: string[]
}

export function buildIndex(docs: { id: string; text: string }[]): Index {
  const indexed: IndexedDoc[] = []
  const docFreqs = new Map<string, number>()
  let totalLength = 0
  for (const doc of docs) {
    const tokens = tokenize(doc.text)
    const termFreqs = new Map<string, number>()
    for (const token of tokens) termFreqs.set(token, (termFreqs.get(token) ?? 0) + 1)
    for (const term of termFreqs.keys()) docFreqs.set(term, (docFreqs.get(term) ?? 0) + 1)
    indexed.push({ id: doc.id, length: tokens.length, termFreqs })
    totalLength += tokens.length
  }
  return {
    docs: indexed,
    docFreqs,
    avgLength: indexed.length > 0 ? totalLength / indexed.length : 0,
  }
}

export function score(index: Index, queryTokens: string[]): Scored[] {
  const n = index.docs.length
  const terms = [...new Set(queryTokens)]
  const results: Scored[] = []
  for (const doc of index.docs) {
    let total = 0
    const matched: string[] = []
    for (const term of terms) {
      const tf = doc.termFreqs.get(term)
      if (tf === undefined) continue
      const df = index.docFreqs.get(term) ?? 0
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5))
      const norm = K1 * (1 - B + B * (doc.length / index.avgLength))
      total += (idf * tf * (K1 + 1)) / (tf + norm)
      matched.push(term)
    }
    if (matched.length > 0) results.push({ id: doc.id, score: total, matched })
  }
  return results.sort((a, b) => b.score - a.score)
}
