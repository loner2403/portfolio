import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyMotionPref, readMotionPref, writeMotionPref } from '../src/lib/motion-pref.ts'

function fakeStorage(initial?: string) {
  let value: string | null = initial ?? null
  return {
    getItem: (key: string) => (key === 'motion-pref' ? value : null),
    setItem: (key: string, next: string) => {
      if (key === 'motion-pref') value = next
    },
    removeItem: (key: string) => {
      if (key === 'motion-pref') value = null
    },
    peek: () => value,
  }
}

const throwing = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
  removeItem: () => {
    throw new Error('blocked')
  },
}

function fakeRoot() {
  const attrs: Record<string, string> = {}
  return {
    setAttribute: (name: string, value: string) => {
      attrs[name] = value
    },
    removeAttribute: (name: string) => {
      delete attrs[name]
    },
    getAttribute: (name: string) => (name in attrs ? attrs[name] : null),
  }
}

test('defaults to on when nothing is stored', () => {
  assert.equal(readMotionPref(fakeStorage()), 'on')
})

test('reads paused when it was stored', () => {
  assert.equal(readMotionPref(fakeStorage('paused')), 'paused')
})

test('any unknown stored value is treated as on', () => {
  assert.equal(readMotionPref(fakeStorage('banana')), 'on')
  assert.equal(readMotionPref(fakeStorage('')), 'on')
})

test('blocked storage reads as on instead of throwing', () => {
  assert.equal(readMotionPref(throwing), 'on')
})

test('no storage at all reads as on', () => {
  assert.equal(readMotionPref(undefined), 'on')
})

test('writing paused stores it, writing on clears it', () => {
  const store = fakeStorage()
  writeMotionPref('paused', store)
  assert.equal(store.peek(), 'paused')
  writeMotionPref('on', store)
  assert.equal(store.peek(), null)
})

test('blocked storage on write never throws', () => {
  assert.doesNotThrow(() => writeMotionPref('paused', throwing))
  assert.doesNotThrow(() => writeMotionPref('on', undefined))
})

test('apply sets data-motion=paused on the root, and removes it for on', () => {
  const root = fakeRoot()
  applyMotionPref('paused', root)
  assert.equal(root.getAttribute('data-motion'), 'paused')
  applyMotionPref('on', root)
  assert.equal(root.getAttribute('data-motion'), null)
})
