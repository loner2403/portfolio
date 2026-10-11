const LINK_PATTERN = /https?:\/\/|www\./i
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/gi
const NUMBER_PATTERN = /\d+(?:[.:,]\d+)*/g
const WORD_PATTERN = /[A-Za-z][A-Za-z0-9]*/g
const UPPER_START = /^[A-Z]/
const SENTENCE_END = /[.!?]$/
const TRAILING_PUNCT = /[.,:]+$/
const ALLOWLIST = new Set(['harshal', 'lade', 'probe', 'i'])
const SENTENCE_STARTERS = new Set([
  'he',
  'his',
  'him',
  'she',
  'her',
  'they',
  'their',
  'it',
  'its',
  'the',
  'a',
  'an',
  'this',
  'that',
  'these',
  'those',
  'there',
  'here',
  'yes',
  'no',
  'sorry',
  'currently',
  'also',
  'and',
  'but',
  'so',
  'or',
  'in',
  'on',
  'at',
  'for',
  'with',
  'as',
  'from',
  'to',
  'by',
  'of',
  'if',
  'when',
  'while',
  'after',
  'before',
  'both',
  'all',
  'some',
  'most',
  'not',
  'none',
  'unfortunately',
  'however',
  'based',
  'open',
  'you',
  'your',
  'we',
  'our',
  'my',
  'check',
  'what',
  'which',
  'who',
  'where',
  'how',
  'why',
  'according',
])

function numberTokens(text: string): string[] {
  return (text.match(NUMBER_PATTERN) ?? []).map((token) => token.replace(TRAILING_PUNCT, ''))
}

function wordSet(text: string): Set<string> {
  return new Set((text.match(WORD_PATTERN) ?? []).map((word) => word.toLowerCase()))
}

function isSentenceInitial(text: string, index: number): boolean {
  const before = text.slice(0, index).replace(/\s+$/, '')
  return before === '' || SENTENCE_END.test(before)
}

export function isGrounded(text: string, passages: string, query: string): boolean {
  if (LINK_PATTERN.test(text)) return false

  const knownPassages = passages.toLowerCase()
  for (const email of text.match(EMAIL_PATTERN) ?? []) {
    if (!knownPassages.includes(email.toLowerCase())) return false
  }

  const withoutEmails = text.replace(EMAIL_PATTERN, ' ')

  const allowedNumbers = new Set([...numberTokens(passages), ...numberTokens(query)])
  for (const token of numberTokens(withoutEmails)) {
    if (!allowedNumbers.has(token)) return false
  }

  const knownWords = wordSet(`${passages} ${query}`)
  for (const match of withoutEmails.matchAll(WORD_PATTERN)) {
    const word = match[0]
    if (!UPPER_START.test(word)) continue
    const lower = word.toLowerCase()
    if (ALLOWLIST.has(lower)) continue
    if (isSentenceInitial(withoutEmails, match.index ?? 0) && SENTENCE_STARTERS.has(lower)) continue
    if (!knownWords.has(lower)) return false
  }

  return true
}
