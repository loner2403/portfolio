import { test } from 'node:test'
import assert from 'node:assert/strict'
import { STORIES } from '../src/lib/stories.ts'
import { SYSTEMS } from '../src/lib/data.ts'

const ids = (els: { id: string }[]) => els.map((el) => el.id)

test('every system has a story', () => {
  for (const system of SYSTEMS) assert.ok(STORIES[system.id], system.id)
  assert.equal(Object.keys(STORIES).length, SYSTEMS.length)
})

test('both layouts share the same unique element ids', () => {
  for (const story of Object.values(STORIES)) {
    const wide = ids(story.wide.els)
    const tall = ids(story.tall.els)
    assert.equal(new Set(wide).size, wide.length, `${story.id} wide duplicate id`)
    assert.equal(new Set(tall).size, tall.length, `${story.id} tall duplicate id`)
    assert.deepEqual([...wide].sort(), [...tall].sort(), `${story.id} layouts differ`)
  }
})

test('steps target real elements, tokens ride real paths, timing fits the cycle', () => {
  for (const story of Object.values(STORIES)) {
    for (const layout of [story.wide, story.tall]) {
      const byId = new Map(layout.els.map((el) => [el.id, el]))
      for (const step of story.steps) {
        assert.ok(byId.has(step.target), `${story.id} step targets missing ${step.target}`)
        assert.ok(step.at >= 0 && step.at + (step.dur ?? 0.6) <= 8, `${story.id} step ${step.target} outside 0-8s`)
      }
      for (const el of layout.els) {
        if (el.kind === 'token') assert.equal(byId.get(el.along)?.kind, 'path', `${story.id} token ${el.id}`)
      }
    }
  }
})

test('each story tells its own sequence', () => {
  const signatures = new Set<string>()
  for (const story of Object.values(STORIES)) {
    const verbs = new Set(story.steps.map((s) => s.do))
    assert.ok(verbs.size >= 4, `${story.id} uses only ${verbs.size} verbs`)
    const signature = story.steps.map((s) => s.do).join(',')
    assert.ok(!signatures.has(signature), `${story.id} repeats another story`)
    signatures.add(signature)
  }
})

test('hidden-at-rest elements are only stamps or text', () => {
  for (const story of Object.values(STORIES)) {
    for (const el of [...story.wide.els, ...story.tall.els]) {
      if ('final' in el && el.final === false) assert.ok(el.kind === 'stamp' || el.kind === 'text', `${story.id} ${el.id}`)
    }
  }
})

test('captions are short and have no dashes', () => {
  for (const story of Object.values(STORIES)) {
    assert.ok(story.caption.length <= 140, story.id)
    assert.ok(!/[–—]/.test(story.caption + JSON.stringify(story)), story.id)
  }
})

test('elements stay inside their viewBox', () => {
  for (const story of Object.values(STORIES)) {
    for (const layout of [story.wide, story.tall]) {
      const [, , vw, vh] = layout.viewBox.split(' ').map(Number)
      for (const el of layout.els) {
        if ('w' in el && 'x' in el) {
          const h = el.kind === 'rows' ? el.rowH * el.count : el.h
          assert.ok(el.x >= 0 && el.x + el.w <= vw, `${story.id} ${el.id} x overflow`)
          assert.ok(el.y >= 0 && el.y + h <= vh, `${story.id} ${el.id} y overflow`)
        }
        if (el.kind === 'box') {
          assert.ok(el.label.length * 6.6 + 20 <= el.w, `${story.id} ${el.id} label too long for box`)
          if (el.sub) assert.ok(el.sub.length * 5.4 + 20 <= el.w, `${story.id} ${el.id} sub too long for box`)
        }
        if (el.kind === 'bubble') {
          assert.ok(el.text.length * 6 + 24 <= el.w, `${story.id} ${el.id} bubble text too long`)
        }
        if (el.kind === 'text') {
          const size = el.size ?? 10
          assert.ok(el.x + el.content.length * size * 0.6 <= vw, `${story.id} ${el.id} text overflows`)
        }
      }
    }
  }
})

test('stamps and boxes never half-overlap', () => {
  type R = { x: number; y: number; w: number; h: number }
  const disjoint = (a: R, b: R) => a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
  const inside = (a: R, b: R) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h
  for (const story of Object.values(STORIES)) {
    for (const [name, layout] of [['wide', story.wide], ['tall', story.tall]] as const) {
      const rects = layout.els.filter((el) => el.kind === 'box' || el.kind === 'doc') as unknown as (R & { id: string })[]
      for (const el of layout.els) {
        if (el.kind !== 'stamp') continue
        const s = { x: el.x - 10, y: el.y - 10, w: 20, h: 20 }
        for (const r of rects) assert.ok(disjoint(s, r) || inside(s, r), `${story.id} ${name} stamp ${el.id} cuts ${r.id}`)
      }
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i]
          const b = rects[j]
          assert.ok(disjoint(a, b) || inside(a, b) || inside(b, a), `${story.id} ${name} ${a.id} overlaps ${b.id}`)
        }
      }
    }
  }
})
