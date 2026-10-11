import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldPreventSmoothScroll } from '../src/motion/prevent.ts'

function node(ancestorSelectors: string[]) {
  return {
    closest(selector: string) {
      const wanted = selector.split(',').map((part) => part.trim())
      return wanted.some((part) => ancestorSelectors.includes(part)) ? {} : null
    },
  } as unknown as HTMLElement
}

test('scrolling inside a role=dialog (chat panel, command palette) is left to the browser', () => {
  assert.equal(shouldPreventSmoothScroll(node(['[role="dialog"]'])), true)
})

test('the command palette overlay is left to the browser so the page behind never smooth-scrolls', () => {
  assert.equal(shouldPreventSmoothScroll(node(['[cmdk-overlay]'])), true)
})

test('any element opting out with data-lenis-prevent is left to the browser', () => {
  assert.equal(shouldPreventSmoothScroll(node(['[data-lenis-prevent]'])), true)
})

test('ordinary page content is still smoothed', () => {
  assert.equal(shouldPreventSmoothScroll(node([])), false)
})
