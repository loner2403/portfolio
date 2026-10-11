import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { IMAGE_SIZES } from '../src/lib/image-sizes.ts'

const data = readFileSync(new URL('../src/lib/data.ts', import.meta.url), 'utf8')
const referenced = [...new Set([...data.matchAll(/'(\/(?:Images|long)\/[^']+\.png)'/g)].map((m) => m[1]))]

function pngSize(path: string) {
  const file = readFileSync(new URL(`../public${path}`, import.meta.url))
  return { w: file.readUInt32BE(16), h: file.readUInt32BE(20) }
}

test('data.ts references at least the known project images', () => {
  assert.ok(referenced.length >= 4, referenced.join(','))
})

test('every referenced PNG exists on disk', () => {
  for (const path of referenced) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `${path} is missing`)
  }
})

test('every referenced PNG has an entry in IMAGE_SIZES', () => {
  for (const path of referenced) {
    assert.ok(IMAGE_SIZES[path], `${path} has no entry`)
  }
})

test('IMAGE_SIZES entries match the real PNG dimensions', () => {
  for (const [path, size] of Object.entries(IMAGE_SIZES)) {
    const real = pngSize(path)
    assert.deepEqual(size, real, `${path}: table says ${size.w}x${size.h}, file is ${real.w}x${real.h}`)
  }
})

test('sizes are positive integers', () => {
  for (const [path, size] of Object.entries(IMAGE_SIZES)) {
    assert.ok(Number.isInteger(size.w) && size.w > 0 && Number.isInteger(size.h) && size.h > 0, path)
  }
})
