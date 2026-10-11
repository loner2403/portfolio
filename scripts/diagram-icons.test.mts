import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ARCHITECTURES } from '../src/lib/architectures.ts'
import { ICON_IDS } from '../src/components/diagram/icon-ids.ts'

const systems = Object.entries(ARCHITECTURES)
const iconNodes = (spec: (typeof ARCHITECTURES)[string]) => spec.nodes.filter((node) => node.kind !== 'tag')

test('there are five systems', () => {
  assert.equal(systems.length, 5)
})

test('every non-tag node declares an icon from the known set', () => {
  for (const [id, spec] of systems) {
    for (const node of iconNodes(spec)) {
      assert.ok(node.icon, `${id}/${node.id} has no icon`)
      assert.ok((ICON_IDS as readonly string[]).includes(node.icon as string), `${id}/${node.id}: unknown icon ${String(node.icon)}`)
    }
  }
})

test('no two nodes in one diagram share an icon', () => {
  for (const [id, spec] of systems) {
    const seen = new Map<string, string>()
    for (const node of iconNodes(spec)) {
      const icon = node.icon as string
      assert.ok(!seen.has(icon), `${id}: ${node.id} and ${seen.get(icon)} both use ${icon}`)
      seen.set(icon, node.id)
    }
  }
})

test('each system has at least three icons that no other system uses', () => {
  const usage = new Map<string, Set<string>>()
  for (const [id, spec] of systems) {
    for (const node of iconNodes(spec)) {
      const icon = node.icon as string
      if (!usage.has(icon)) usage.set(icon, new Set())
      usage.get(icon)!.add(id)
    }
  }
  for (const [id] of systems) {
    const unique = [...usage.entries()].filter(([, owners]) => owners.size === 1 && owners.has(id)).map(([icon]) => icon)
    assert.ok(unique.length >= 3, `${id} has only ${unique.length} unique icons: ${unique.join(', ')}`)
  }
})

test('icon ids are unique and non-empty', () => {
  assert.equal(new Set(ICON_IDS).size, ICON_IDS.length)
  assert.ok(ICON_IDS.length >= 30)
})
