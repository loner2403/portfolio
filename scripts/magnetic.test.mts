import { test } from 'node:test'
import assert from 'node:assert/strict'
import { magneticOffset } from '../src/motion/magnetic.ts'

test('pointer at the centre of the button gives no pull', () => {
  assert.deepEqual(magneticOffset(0, 0, 100), { x: 0, y: 0 })
})

test('pull is 30 percent of the pointer offset', () => {
  assert.deepEqual(magneticOffset(10, -20, 100), { x: 3, y: -6 })
})

test('pull is clamped to 8 pixels on each axis', () => {
  assert.deepEqual(magneticOffset(60, 0, 200), { x: 8, y: 0 })
  assert.deepEqual(magneticOffset(0, -90, 200), { x: 0, y: -8 })
  assert.deepEqual(magneticOffset(-90, 90, 200), { x: -8, y: 8 })
})

test('pointer farther than the reach gives no pull and never negative zero', () => {
  const out = magneticOffset(80, 80, 100)
  assert.ok(Object.is(out.x, 0) && Object.is(out.y, 0), JSON.stringify(out))
})

test('exactly at the reach edge still pulls, so there is no flicker at the boundary', () => {
  assert.deepEqual(magneticOffset(100, 0, 100), { x: 8, y: 0 })
})

test('non-finite input gives no pull', () => {
  assert.deepEqual(magneticOffset(Number.NaN, 5, 100), { x: 0, y: 0 })
  assert.deepEqual(magneticOffset(5, Number.POSITIVE_INFINITY, 100), { x: 0, y: 0 })
})
