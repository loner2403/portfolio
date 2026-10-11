import { test } from 'node:test'
import assert from 'node:assert/strict'
import { followX } from '../src/motion/follow.ts'

test('card sits 20px to the right of the pointer, measured from the row left edge', () => {
  assert.equal(followX(300, 100, 1000, 240), 220)
})

test('card never goes left of the row', () => {
  assert.equal(followX(90, 100, 1000, 240), 0)
  assert.equal(followX(100, 100, 1000, 240), 20)
})

test('card never goes past the row right edge, keeping a 24px margin', () => {
  assert.equal(followX(1090, 100, 1000, 240), 1000 - 240 - 24)
})

test('when the row is narrower than the card the card stays at 0', () => {
  assert.equal(followX(150, 100, 200, 240), 0)
})

test('non-finite input gives 0', () => {
  assert.equal(followX(Number.NaN, 100, 1000, 240), 0)
  assert.equal(followX(300, 100, Number.POSITIVE_INFINITY, 240), 0)
})

test('never returns negative zero', () => {
  assert.ok(Object.is(followX(0, 100, 200, 240), 0))
  assert.ok(Object.is(followX(Number.NaN, 0, 0, 0), 0))
})
