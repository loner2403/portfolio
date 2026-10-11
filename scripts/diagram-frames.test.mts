import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ARCHITECTURES } from '../src/lib/architectures.ts'
import { FRAME_IDS } from '../src/components/diagram/frame-ids.ts'

const systems = Object.entries(ARCHITECTURES)

test('the frame set has exactly five styles', () => {
  assert.deepEqual([...FRAME_IDS], ['square', 'dogear', 'stacked', 'pill', 'barred'])
})

test('every system declares a frame from the known set', () => {
  for (const [id, spec] of systems) {
    assert.ok(spec.frame, `${id} has no frame`)
    assert.ok((FRAME_IDS as readonly string[]).includes(spec.frame as string), `${id}: unknown frame ${String(spec.frame)}`)
  }
})

test('all five systems use five different frames', () => {
  const frames = systems.map(([, spec]) => spec.frame)
  assert.equal(new Set(frames).size, 5, frames.join(','))
})

test('frames match the system they describe', () => {
  assert.equal(ARCHITECTURES['S-01'].frame, 'square')
  assert.equal(ARCHITECTURES['S-02'].frame, 'dogear')
  assert.equal(ARCHITECTURES['S-03'].frame, 'stacked')
  assert.equal(ARCHITECTURES['S-04'].frame, 'pill')
  assert.equal(ARCHITECTURES['S-05'].frame, 'barred')
})
