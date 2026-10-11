import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { POST } from '../api/unanswered.ts'

const realFetch = globalThis.fetch
let calls: { url: string; init: RequestInit }[] = []
let upstream: () => Response = () => new Response('{"ok":true}', { status: 200 })

beforeEach(() => {
  calls = []
  process.env.TELEGRAM_BOT_TOKEN = '123:secret-token'
  process.env.TELEGRAM_CHAT_ID = '987654'
  upstream = () => new Response('{"ok":true}', { status: 200 })
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} })
    return upstream()
  }) as typeof fetch
})

const call = (body: unknown, ip = '10.1.0.1') =>
  POST(
    new Request('https://harshallade.site/api/unanswered', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    }),
  )

const sentText = () => JSON.parse(String(calls[0].init.body)).text as string

test('sends the question, email and page to the configured Telegram chat as plain text', async () => {
  const res = await call({ question: 'Do you do freelance work?', email: 'visitor@example.com', page: '/projects/resume-roaster' }, '10.1.1.1')
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://api.telegram.org/bot123:secret-token/sendMessage')
  const sent = JSON.parse(String(calls[0].init.body))
  assert.equal(sent.chat_id, '987654')
  assert.equal(sent.parse_mode, undefined, 'plain text only, so visitor input cannot inject formatting')
  assert.ok(sentText().includes('Do you do freelance work?'))
  assert.ok(sentText().includes('visitor@example.com'))
  assert.ok(sentText().includes('/projects/resume-roaster'))
  assert.ok(calls[0].init.signal instanceof AbortSignal, 'Telegram call must have a timeout')
})

test('email is optional', async () => {
  const res = await call({ question: 'Do you do freelance work?' }, '10.1.2.1')
  assert.equal(res.status, 200)
  assert.equal(calls.length, 1)
  assert.ok(/email: none/i.test(sentText()))
})

test('returns 503 and never calls Telegram when it is not configured', async () => {
  delete process.env.TELEGRAM_BOT_TOKEN
  let res = await call({ question: 'hello there' }, '10.1.3.1')
  assert.equal(res.status, 503)
  process.env.TELEGRAM_BOT_TOKEN = 't'
  delete process.env.TELEGRAM_CHAT_ID
  res = await call({ question: 'hello there' }, '10.1.3.2')
  assert.equal(res.status, 503)
  assert.equal(calls.length, 0)
})

test('rejects bad questions and bad emails with 400 and never calls Telegram', async () => {
  const bad = [
    {},
    { question: 42 },
    { question: '' },
    { question: '   ' },
    { question: 'x'.repeat(201) },
    { question: 'fine question', email: 'not-an-email' },
    { question: 'fine question', email: `${'a'.repeat(250)}@example.com` },
    { question: 'fine question', email: 42 },
  ]
  let n = 0
  for (const body of bad) {
    n += 1
    const res = await call(body, `10.1.4.${n}`)
    assert.equal(res.status, 400, JSON.stringify(body).slice(0, 60))
  }
  const raw = await POST(new Request('https://harshallade.site/api/unanswered', { method: 'POST', body: 'not json' }))
  assert.equal(raw.status, 400)
  assert.equal(calls.length, 0)
})

test('a filled honeypot looks successful to the bot but sends nothing', async () => {
  const res = await call({ question: 'buy cheap stuff', website: 'http://spam.example' }, '10.1.5.1')
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(calls.length, 0)
})

test('control characters are stripped and newlines collapsed in the forwarded question', async () => {
  await call({ question: 'line one\nline two\u0000\u0007 end' }, '10.1.6.1')
  const text = sentText()
  assert.ok(text.includes('line one line two end'), text)
  assert.ok(!/[\u0000-\u0008]/.test(text))
})

test('page is only forwarded when it is a short site path', async () => {
  await call({ question: 'question one', page: 'https://evil.example/x' }, '10.1.7.1')
  assert.ok(!sentText().includes('evil.example'))
  calls = []
  await call({ question: 'question two', page: `/${'a'.repeat(200)}` }, '10.1.7.2')
  assert.ok(!sentText().includes('a'.repeat(150)))
})

test('Telegram failures return ok:false without throwing or leaking the token', async () => {
  upstream = () => new Response('{"ok":false}', { status: 400 })
  let res = await call({ question: 'question one' }, '10.1.8.1')
  let body = await res.json()
  assert.equal(body.ok, false)
  assert.ok(!JSON.stringify(body).includes('secret-token'))
  upstream = () => {
    throw new Error('network down 123:secret-token')
  }
  res = await call({ question: 'question two' }, '10.1.8.2')
  body = await res.json()
  assert.equal(body.ok, false)
  assert.ok(!JSON.stringify(body).includes('secret-token'))
})

test('per-IP limit: 3 questions per 10 minutes, then 429', async () => {
  const statuses: number[] = []
  for (let i = 0; i < 4; i += 1) statuses.push((await call({ question: `question ${i}` }, '10.1.9.1')).status)
  assert.deepEqual(statuses, [200, 200, 200, 429])
  assert.equal(calls.length, 3)
  assert.equal((await call({ question: 'other visitor' }, '10.1.9.2')).status, 200)
})

test.after(() => {
  globalThis.fetch = realFetch
})
