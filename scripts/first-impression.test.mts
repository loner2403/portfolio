import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { SYSTEMS } from '../src/lib/data.ts'

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8')
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const FONT = new URL('../src/assets/fonts/archivo-expanded-800-latin.woff2', import.meta.url)

test('display font is the self-hosted Archivo Expanded subset', () => {
  assert.ok(existsSync(FONT))
  assert.ok(statSync(FONT).size < 16_000, 'display font subset should stay small')
  assert.match(css, /--font-display:\s*"Archivo Expanded"/)
  assert.match(css, /@font-face\s*{[^}]*font-family:\s*"Archivo Expanded"[^}]*archivo-expanded-800-latin\.woff2[^}]*font-display:\s*swap/s)
})

test('fallback faces are metric-matched to stop layout shift on font swap', () => {
  assert.match(css, /font-family:\s*"Archivo Expanded Fallback"[^}]*size-adjust:\s*129\.3%/s)
  assert.match(css, /font-family:\s*"Space Grotesk Fallback"[^}]*size-adjust:\s*110\.3%/s)
  assert.match(css, /--font-sans:\s*"Space Grotesk Variable",\s*"Space Grotesk Fallback"/)
  assert.match(css, /--font-display:\s*"Archivo Expanded",\s*"Archivo Expanded Fallback"/)
})

test('instrument serif is fully removed', () => {
  assert.ok(!/instrument/i.test(css))
  assert.ok(!/instrument/i.test(main))
  assert.ok(!pkg.dependencies['@fontsource/instrument-serif'])
})

test('hero entrance finishes quickly: words and actions start within 450ms', () => {
  const word = css.match(/\.word\s*{[^}]*animation-delay:\s*calc\(var\(--i\)\s*\*\s*(\d+)ms\s*\+\s*(\d+)ms\)/s)
  assert.ok(word, 'word delay rule')
  const [, step, base] = word.map(Number)
  assert.ok(base + step * 9 <= 450, `last word starts at ${base + step * 9}ms`)
})

test('numbers are shown in dollars and the user count is approximate', () => {
  const text = JSON.stringify(SYSTEMS)
  assert.ok(!/Rs\s?\d/.test(text), 'no rupee figures')
  assert.ok(!text.includes('9,000'), 'no exact user count')
  const s02 = SYSTEMS.find((s) => s.id === 'S-02')!.caseStudy.results.map((r) => r.value)
  const s04 = SYSTEMS.find((s) => s.id === 'S-04')!.caseStudy.results.map((r) => r.value)
  assert.ok(s02.includes('~$35'))
  assert.ok(s04.includes('9K+'))
})
