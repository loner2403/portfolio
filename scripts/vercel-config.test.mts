import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

type Redirect = {
  source: string
  destination: string
  permanent?: boolean
  has?: { type: string; value: string }[]
}

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { redirects: Redirect[] }
const hostRules = config.redirects.filter((rule) => rule.has?.some((cond) => cond.type === 'host'))
const hostOf = (rule: Redirect) => rule.has!.find((cond) => cond.type === 'host')!.value

const OLD_HOSTS = [
  'portfolio-2-omega-lovat.vercel.app',
  'portfolio-2-loner2403s-projects.vercel.app',
  'portfolio-2-git-main-loner2403s-projects.vercel.app',
  'portfolio-2-loner2403-loner2403s-projects.vercel.app',
  'harshallade.xyz',
  'www.harshallade.xyz',
]

const NEW_SITE_HOSTS = ['harshallade.site', 'harshallade-site.vercel.app', 'harshallade-site-loner2403s-projects.vercel.app']

test('every old portfolio address redirects to the new site', () => {
  for (const host of OLD_HOSTS) {
    const rule = hostRules.find((r) => hostOf(r) === host)
    assert.ok(rule, `no redirect rule for ${host}`)
    assert.equal(rule.destination, 'https://harshallade.site/$1', host)
    assert.equal(rule.permanent, true, `${host} should be a permanent redirect`)
    assert.equal(rule.source, '/(.*)', host)
  }
})

test('no rule can redirect the new site to itself (no loops)', () => {
  for (const rule of hostRules) {
    const host = hostOf(rule)
    assert.ok(!NEW_SITE_HOSTS.includes(host), `rule for ${host} would redirect the live site`)
    assert.ok(!/^\.?\*?$/.test(host) && !host.includes('.*'), `host rule ${host} must be an exact host, not a pattern`)
  }
})

test('the existing www redirect is still present', () => {
  const www = hostRules.find((r) => hostOf(r) === 'www.harshallade.site')
  assert.ok(www)
  assert.equal(www.destination, 'https://harshallade.site/$1')
})

test('every redirect destination points at the new site', () => {
  for (const rule of config.redirects) {
    assert.ok(rule.destination.startsWith('https://harshallade.site/'), rule.destination)
  }
})

test('host values are unique', () => {
  const hosts = hostRules.map(hostOf)
  assert.equal(new Set(hosts).size, hosts.length)
})
