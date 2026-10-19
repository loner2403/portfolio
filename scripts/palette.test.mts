import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const theme = css.slice(css.indexOf('@theme'), css.indexOf('}', css.indexOf('@theme')))

function token(name: string): string {
  const match = theme.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
  assert.ok(match, `missing --color-${name}`)
  return match[1].toUpperCase()
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

test('warm palette tokens are exactly as specified', () => {
  assert.equal(token('bg'), '#14110F')
  assert.equal(token('panel'), '#1B1714')
  assert.equal(token('panel-2'), '#231E19')
  assert.equal(token('line'), '#2E2620')
  assert.equal(token('ink'), '#F3EBDD')
  assert.equal(token('muted'), '#A39683')
  assert.equal(token('faint'), '#8F8372')
  assert.equal(token('signal'), '#FFE899')
  assert.equal(token('signal-ink'), '#14110F')
  assert.equal(token('card-1'), '#FFE899')
  assert.equal(token('card-2'), '#FFCE94')
  assert.equal(token('card-3'), '#FF8A65')
})

test('text and accent tokens meet WCAG contrast on the base', () => {
  const bg = token('bg')
  assert.ok(contrast(token('ink'), bg) >= 7)
  assert.ok(contrast(token('muted'), bg) >= 4.5)
  assert.ok(contrast(token('faint'), bg) >= 4.5)
  assert.ok(contrast(token('signal'), bg) >= 7)
  assert.ok(contrast(token('signal-ink'), token('signal')) >= 7)
  for (const n of ['card-1', 'card-2', 'card-3']) assert.ok(contrast(token(n), bg) >= 4.5, n)
})

test('no leftover lime colour in css', () => {
  assert.ok(!/c6ff3d/i.test(css))
  assert.ok(!/198,\s*255,\s*61/.test(css))
})
