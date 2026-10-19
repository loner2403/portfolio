import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CARD_BG, cardBg, cardIndex, cardVar } from '../src/lib/cards.ts'

test('cycles through the three card colours by index', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(cardIndex), [0, 1, 2, 0, 1, 2])
  assert.deepEqual(CARD_BG, ['bg-card-1', 'bg-card-2', 'bg-card-3'])
})

test('background class and css variable agree for the same index', () => {
  for (let i = 0; i < 7; i++) {
    const n = cardIndex(i) + 1
    assert.equal(cardBg(i), `bg-card-${n}`)
    assert.equal(cardVar(i), `var(--color-card-${n})`)
  }
})

test('card classes are literal strings Tailwind can see', () => {
  const source = readFileSync(new URL('../src/lib/cards.ts', import.meta.url), 'utf8')
  for (const name of CARD_BG) assert.ok(source.includes(`'${name}'`), name)
})

test('every card token exists in the theme', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  for (const n of [1, 2, 3]) assert.match(css, new RegExp(`--color-card-${n}:\\s*#`))
})
