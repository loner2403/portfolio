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

test('black and orange palette tokens are exactly as specified', () => {
  assert.equal(token('bg'), '#0B0B0B')
  assert.equal(token('panel'), '#141414')
  assert.equal(token('panel-2'), '#1C1C1C')
  assert.equal(token('line'), '#262626')
  assert.equal(token('ink'), '#F2F0EB')
  assert.equal(token('muted'), '#A6A6A6')
  assert.equal(token('faint'), '#8C8C8C')
  assert.equal(token('signal'), '#FF7036')
  assert.equal(token('signal-ink'), '#0B0B0B')
  assert.equal(token('card-1'), '#FF7036')
  assert.equal(token('card-2'), '#EDE8DD')
  assert.equal(token('card-3'), '#A8BDFF')
})

test('dark ink is readable on every card colour', () => {
  for (const n of ['card-1', 'card-2', 'card-3']) assert.ok(contrast('#0B0B0B', token(n)) >= 7, n)
})

test('no leftover warm-gold or brown values outside the theme', () => {
  const rest = css.slice(css.indexOf('}', css.indexOf('@theme')))
  for (const old of ['#FFE899', '#FFCE94', '#FF8A65', '#14110F', '#1B1714', '#2E2620', '#F3EBDD', '#A39683', '#8F8372', '255, 232, 153']) {
    assert.ok(!rest.toUpperCase().includes(old.toUpperCase()), `leftover ${old}`)
  }
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
