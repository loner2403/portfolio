import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatClock } from '../src/lib/clock.ts'

test('formats a UTC instant in Asia/Kolkata as HH:MM', () => {
  assert.equal(formatClock(new Date('2026-10-18T00:00:00Z'), 'Asia/Kolkata'), '05:30')
  assert.equal(formatClock(new Date('2026-10-18T18:45:00Z'), 'Asia/Kolkata'), '00:15')
})

test('pads single digits and uses 24h time', () => {
  assert.equal(formatClock(new Date('2026-01-05T03:34:00Z'), 'Asia/Kolkata'), '09:04')
  assert.equal(formatClock(new Date('2026-01-05T12:00:00Z'), 'UTC'), '12:00')
})

test('falls back to UTC on an invalid timezone instead of throwing', () => {
  assert.equal(formatClock(new Date('2026-01-05T12:00:00Z'), 'Not/AZone'), '12:00')
})
