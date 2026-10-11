import { test } from 'node:test'
import assert from 'node:assert/strict'
import { refreshScenes, setRefresher } from '../src/motion/bus.ts'

test('refreshScenes does nothing when no refresher is registered', () => {
  setRefresher(null)
  assert.doesNotThrow(() => refreshScenes())
})

test('refreshScenes calls the registered refresher once per call', () => {
  let calls = 0
  setRefresher(() => {
    calls += 1
  })
  refreshScenes()
  refreshScenes()
  assert.equal(calls, 2)
  setRefresher(null)
})

test('registering a new refresher replaces the old one', () => {
  const seen: string[] = []
  setRefresher(() => seen.push('first'))
  setRefresher(() => seen.push('second'))
  refreshScenes()
  assert.deepEqual(seen, ['second'])
  setRefresher(null)
})

test('setRefresher(null) unregisters', () => {
  let calls = 0
  setRefresher(() => {
    calls += 1
  })
  setRefresher(null)
  refreshScenes()
  assert.equal(calls, 0)
})

import { scrollToTop } from '../src/motion/bus.ts'

type Call = unknown[]

function withWindow(run: (calls: Call[]) => void) {
  const calls: Call[] = []
  const g = globalThis as unknown as { window?: unknown }
  const previous = g.window
  g.window = { scrollTo: (...args: Call) => calls.push(args), matchMedia: () => ({ matches: false }) }
  try {
    run(calls)
  } finally {
    g.window = previous
  }
}

test('scrollToTop without a smooth scroller jumps instantly, ignoring CSS scroll-behavior', async () => {
  const { setScroller } = await import('../src/motion/bus.ts')
  setScroller(null)
  withWindow((calls) => {
    scrollToTop()
    assert.equal(calls.length, 1)
    assert.deepEqual(calls[0], [{ top: 0, left: 0, behavior: 'instant' }])
  })
})

test('scrollToTop uses the smooth scroller when one is registered and does not touch window.scrollTo', async () => {
  const { setScroller } = await import('../src/motion/bus.ts')
  let used = 0
  setScroller({ scrollTo: () => {}, scrollTop: () => { used += 1 } })
  withWindow((calls) => {
    scrollToTop()
    assert.equal(used, 1)
    assert.equal(calls.length, 0)
  })
  setScroller(null)
})

import { scrollToTarget } from '../src/motion/bus.ts'

test('scrollToTarget(instant) asks for an instant jump so CSS scroll-behavior cannot turn it into a glide', async () => {
  const { setScroller } = await import('../src/motion/bus.ts')
  setScroller(null)
  const seen: unknown[] = []
  const target = { scrollIntoView: (opts: unknown) => seen.push(opts) } as unknown as HTMLElement
  withWindow(() => {
    scrollToTarget(target, true)
  })
  assert.deepEqual(seen, [{ behavior: 'instant' }])
})

test('scrollToTarget(non-instant) without a scroller still glides, or jumps under reduced motion', async () => {
  const { setScroller } = await import('../src/motion/bus.ts')
  setScroller(null)
  const seen: unknown[] = []
  const target = { scrollIntoView: (opts: unknown) => seen.push(opts) } as unknown as HTMLElement
  const g = globalThis as unknown as { window?: unknown }
  const previous = g.window
  g.window = { matchMedia: () => ({ matches: false }) }
  scrollToTarget(target)
  g.window = { matchMedia: () => ({ matches: true }) }
  scrollToTarget(target)
  g.window = previous
  assert.deepEqual(seen, [{ behavior: 'smooth' }, { behavior: 'auto' }])
})
