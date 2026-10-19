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

test('paper palette tokens are exactly as specified', () => {
  const expected: Record<string, string> = {
    bg: '#F3F1EC', panel: '#EAE7E0', 'panel-2': '#E1DDD4', line: '#D6D1C6',
    ink: '#111111', muted: '#55524C', faint: '#66625A',
    signal: '#B93D0E', 'signal-ink': '#FFFFFF', flame: '#E4501A',
    'card-1': '#FF7A3D', 'card-2': '#FFFFFF', 'card-3': '#C9D5FF',
  }
  for (const [name, value] of Object.entries(expected)) assert.equal(token(name), value, name)
})

test('text tokens meet WCAG AA on paper', () => {
  const bg = token('bg')
  assert.ok(contrast(token('ink'), bg) >= 12)
  assert.ok(contrast(token('muted'), bg) >= 4.5)
  assert.ok(contrast(token('faint'), bg) >= 4.5)
  assert.ok(contrast(token('signal'), bg) >= 4.5, 'signal text')
  assert.ok(contrast(token('signal-ink'), token('signal')) >= 4.5, 'text on signal buttons')
  assert.ok(contrast(token('flame'), bg) >= 3, 'flame is large-text only')
})

test('dark ink is readable on every card colour', () => {
  for (const n of ['card-1', 'card-2', 'card-3']) assert.ok(contrast('#111111', token(n)) >= 7, n)
})

test('page is light and no dark-theme leftovers remain outside the theme', () => {
  assert.match(css, /color-scheme:\s*light/)
  const rest = css.slice(css.indexOf('}', css.indexOf('@theme')))
  for (const old of ['#14110F', '#1B1714', '#F3EBDD', '#A39683', '255, 232, 153', '#3A3A3A', '#444444', '#34423A', '#3C4A41']) {
    assert.ok(!rest.toUpperCase().includes(old.toUpperCase()), `leftover ${old}`)
  }
})

test('no leftover lime colour in css', () => {
  assert.ok(!/c6ff3d/i.test(css))
  assert.ok(!/198,\s*255,\s*61/.test(css))
})
