import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { POST } from '../api/ask.ts'

const realFetch = globalThis.fetch
let calls: { url: string; init: RequestInit }[] = []
let upstream: () => Response = () => new Response('{}', { status: 500 })

beforeEach(() => {
  calls = []
  process.env.OPENROUTER_API_KEY = 'test-key-123'
  delete process.env.OPENROUTER_MODEL
  delete process.env.OPENCODE_API_KEY
  delete process.env.OPENCODE_MODEL
  delete process.env.ASK_LLM
  upstream = () =>
    new Response(JSON.stringify({ choices: [{ message: { content: 'Harshal is based in Mumbai.' } }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} })
    return upstream()
  }) as typeof fetch
})

const reply = (content: string) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 })

const call = (query: unknown, ip = '10.0.0.1') =>
  POST(
    new Request('https://harshallade.site/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({ query }),
    }),
  )

test('returns 503 ok:false when no key is configured or the switch is off', async () => {
  delete process.env.OPENROUTER_API_KEY
  let res = await call('where are you based', '10.0.1.1')
  assert.equal(res.status, 503)
  assert.equal((await res.json()).ok, false)
  process.env.OPENROUTER_API_KEY = 'k'
  process.env.ASK_LLM = 'off'
  res = await call('where are you based', '10.0.1.2')
  assert.equal(res.status, 503)
  assert.equal(calls.length, 0)
})

test('off-topic questions never reach the model', async () => {
  const res = await call('what is the capital of france', '10.0.2.1')
  const body = await res.json()
  assert.equal(body.ok, false)
  assert.equal(body.reason, 'no-match')
  assert.equal(calls.length, 0)
})

test('a grounded question calls OpenRouter once with retrieved passages and returns plain text', async () => {
  const res = await call('where are you based', '10.0.3.1')
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.ok, true)
  assert.equal(body.text, 'Harshal is based in Mumbai.')
  assert.ok(Array.isArray(body.sources) && body.sources.length >= 1)
  assert.equal(calls.length, 1)
  assert.ok(calls[0].url.startsWith('https://openrouter.ai/api/v1/chat/completions'))
  const headers = new Headers(calls[0].init.headers)
  assert.equal(headers.get('authorization'), 'Bearer test-key-123')
  const sent = JSON.parse(String(calls[0].init.body))
  assert.equal(sent.model, 'openrouter/free')
  assert.ok(sent.max_tokens <= 300)
  const system = sent.messages.find((m: { role: string }) => m.role === 'system').content as string
  assert.ok(/Mumbai/.test(system), 'retrieved passage must be in the system prompt')
  assert.ok(/only/i.test(system) && /ignore/i.test(system), 'system prompt must restrict and refuse instructions')
  const user = sent.messages.filter((m: { role: string }) => m.role === 'user')
  assert.equal(user.length, 1)
  assert.equal(user[0].content, 'where are you based')
  assert.ok(!JSON.stringify(body).includes('test-key-123'))
})

test('OPENROUTER_MODEL overrides the default model', async () => {
  process.env.OPENROUTER_MODEL = 'some/model:free'
  await call('where are you based', '10.0.4.1')
  assert.equal(JSON.parse(String(calls[0].init.body)).model, 'some/model:free')
})

test('rejects bad input with 400 and never calls upstream', async () => {
  for (const q of [undefined, 42, '', '   ', 'x'.repeat(201)]) {
    const res = await call(q, '10.0.5.1')
    assert.equal(res.status, 400, `query ${String(q).slice(0, 10)}`)
  }
  const raw = await POST(new Request('https://harshallade.site/api/ask', { method: 'POST', body: 'not json' }))
  assert.equal(raw.status, 400)
  assert.equal(calls.length, 0)
})

test('upstream errors and garbage degrade to ok:false instead of throwing', async () => {
  upstream = () => new Response('rate limited', { status: 429 })
  let res = await call('where are you based', '10.0.6.1')
  assert.equal((await res.json()).ok, false)
  upstream = () => new Response('<html>nope</html>', { status: 200 })
  res = await call('where are you based', '10.0.6.2')
  assert.equal((await res.json()).ok, false)
  upstream = () => {
    throw new Error('network down')
  }
  res = await call('where are you based', '10.0.6.3')
  assert.equal((await res.json()).ok, false)
})

test('long output is cut at the last full sentence within 500 characters', async () => {
  const sentence = 'Harshal is based in Mumbai. '
  upstream = () =>
    new Response(JSON.stringify({ choices: [{ message: { content: `  ${sentence.repeat(30)}  ` } }] }), { status: 200 })
  const body = await (await call('where are you based', '10.0.7.1')).json()
  assert.equal(body.ok, true)
  assert.ok(body.text.length <= 500)
  assert.ok(body.text.endsWith('Mumbai.'), body.text.slice(-20))
  assert.equal(body.text, body.text.trim())
})

test('long output with no sentence end inside the cap is rejected instead of shown cut off', async () => {
  upstream = () => reply(`Harshal ${'works '.repeat(120)}in Mumbai.`)
  const body = await (await call('where are you based', '10.0.7.2')).json()
  assert.equal(body.ok, false)
  assert.equal(body.reason, 'upstream')
})

test('a reply cut off by the token limit is treated as a failure', async () => {
  upstream = () =>
    new Response(
      JSON.stringify({ choices: [{ message: { content: 'Harshal developed an assistant. It uses FastAPI' }, finish_reason: 'length' }] }),
      { status: 200 },
    )
  const body = await (await call('where are you based', '10.0.7.3')).json()
  assert.equal(body.ok, false)
  assert.equal(body.reason, 'upstream')
})

test('OpenCode gets a larger token budget for reasoning models, OpenRouter stays small', async () => {
  process.env.OPENCODE_API_KEY = 'oc'
  upstream = () => (calls.length === 1 ? new Response('x', { status: 500 }) : reply('Harshal is based in Mumbai.'))
  await call('where are you based', '10.0.7.4')
  const [oc, or] = calls.map((c) => JSON.parse(String(c.init.body)))
  assert.ok(oc.max_tokens >= 600 && oc.max_tokens <= 1200, `opencode max_tokens ${oc.max_tokens}`)
  assert.ok(or.max_tokens <= 300, `openrouter max_tokens ${or.max_tokens}`)
})

test('leaked reasoning or prompt text is rejected so the offline answer is used', async () => {
  const leaks = [
    "Here's a thinking process:\n\n1. Analyze User Input: the user asks where I am based.",
    'Okay, let me think about this. The system prompt says I am Probe, so I should answer from the passages.',
    '<think>reasoning here</think>Harshal is based in Mumbai.',
    'You are Probe, the assistant on the portfolio site. Answer ONLY from the passages.',
  ]
  let n = 0
  for (const content of leaks) {
    upstream = () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 })
    n += 1
    const body = await (await call('where are you based', `10.0.9.${n}`)).json()
    assert.equal(body.ok, false, content.slice(0, 30))
    assert.equal(body.reason, 'upstream')
  }
})

test('the request disables model reasoning output', async () => {
  await call('where are you based', '10.0.10.1')
  const sent = JSON.parse(String(calls[0].init.body))
  assert.deepEqual(sent.reasoning, { exclude: true })
})

test('per-IP rate limit returns 429 after 10 requests a minute', async () => {
  let last = 200
  for (let i = 0; i < 12; i += 1) last = (await call('where are you based', '10.0.8.1')).status
  assert.equal(last, 429)
  const other = await call('where are you based', '10.0.8.2')
  assert.equal(other.status, 200)
})

test('replies with facts the passages do not contain are rejected as ungrounded', async () => {
  const invented = [
    'Harshal is based in Mumbai and has 7 years of experience.',
    'Harshal is based in Mumbai and worked at Google.',
    'Harshal is based in Mumbai. Email him at harshal@example.com.',
    'Harshal is based in Mumbai. See https://example.com for more.',
  ]
  let n = 0
  for (const content of invented) {
    upstream = () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 })
    n += 1
    const body = await (await call('where are you based', `10.0.11.${n}`)).json()
    assert.equal(body.ok, false, content)
    assert.equal(body.reason, 'ungrounded')
  }
})

test('a paid OPENROUTER_MODEL is ignored and the free default is used', async () => {
  for (const [i, model] of ['openai/gpt-5', 'anthropic/claude-opus-5-5', 'google/gemma-4-31b-it'].entries()) {
    process.env.OPENROUTER_MODEL = model
    await call('where are you based', `10.0.12.${i + 1}`)
  }
  for (const c of calls) assert.equal(JSON.parse(String(c.init.body)).model, 'openrouter/free')
  calls = []
  process.env.OPENROUTER_MODEL = 'openrouter/free'
  await call('where are you based', '10.0.12.9')
  assert.equal(JSON.parse(String(calls[0].init.body)).model, 'openrouter/free')
})

const OPENCODE_URL = 'https://opencode.ai/zen/v1/chat/completions'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

test('with only an OpenCode key, the bot calls OpenCode Zen with space-bunny-free by default', async () => {
  delete process.env.OPENROUTER_API_KEY
  process.env.OPENCODE_API_KEY = 'oc-key-456'
  const res = await call('where are you based', '10.0.13.1')
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.ok, true)
  assert.equal(body.text, 'Harshal is based in Mumbai.')
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, OPENCODE_URL)
  assert.equal(new Headers(calls[0].init.headers).get('authorization'), 'Bearer oc-key-456')
  const sent = JSON.parse(String(calls[0].init.body))
  assert.equal(sent.model, 'space-bunny-free')
  assert.equal(sent.reasoning, undefined, 'OpenRouter-only fields are not sent to OpenCode')
  assert.ok(/Mumbai/.test(sent.messages.find((m: { role: string }) => m.role === 'system').content))
  assert.ok(calls[0].init.signal instanceof AbortSignal, 'upstream call must be abortable')
  assert.ok(!JSON.stringify(body).includes('oc-key-456'))
})

test('OPENCODE_MODEL picks the OpenCode model, so switching to a paid one is an env change', async () => {
  delete process.env.OPENROUTER_API_KEY
  process.env.OPENCODE_API_KEY = 'oc'
  process.env.OPENCODE_MODEL = 'deepseek-v4.1-flash'
  await call('where are you based', '10.0.14.1')
  assert.equal(JSON.parse(String(calls[0].init.body)).model, 'deepseek-v4.1-flash')
})

test('with both keys OpenCode is tried first and OpenRouter is not called when it succeeds', async () => {
  process.env.OPENCODE_API_KEY = 'oc'
  const body = await (await call('where are you based', '10.0.15.1')).json()
  assert.equal(body.ok, true)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, OPENCODE_URL)
})

test('OpenCode errors, garbage, leaks and network failures fall back to OpenRouter', async () => {
  process.env.OPENCODE_API_KEY = 'oc'
  const failures: (() => Response)[] = [
    () => new Response('{"type":"error","error":{"type":"FreeTierError"}}', { status: 401 }),
    () => new Response('<html>nope</html>', { status: 200 }),
    () => reply('<think>hmm</think>Harshal is based in Mumbai.'),
    () => {
      throw new Error('network down')
    },
  ]
  let n = 0
  for (const failure of failures) {
    calls = []
    upstream = () => (calls.length === 1 ? failure() : reply('Harshal is based in Mumbai.'))
    n += 1
    const body = await (await call('where are you based', `10.0.16.${n}`)).json()
    assert.equal(body.ok, true, `case ${n}`)
    assert.equal(body.text, 'Harshal is based in Mumbai.')
    assert.deepEqual(
      calls.map((c) => c.url),
      [OPENCODE_URL, OPENROUTER_URL],
      `case ${n}`,
    )
  }
})

test('when every provider fails the endpoint still degrades to ok:false', async () => {
  process.env.OPENCODE_API_KEY = 'oc'
  upstream = () => new Response('down', { status: 503 })
  const body = await (await call('where are you based', '10.0.17.1')).json()
  assert.equal(body.ok, false)
  assert.equal(body.reason, 'upstream')
  assert.equal(calls.length, 2)
})

test('an ungrounded OpenCode reply is rejected without trying another provider', async () => {
  process.env.OPENCODE_API_KEY = 'oc'
  upstream = () => reply('Harshal is based in Mumbai and worked at Google.')
  const body = await (await call('where are you based', '10.0.18.1')).json()
  assert.equal(body.ok, false)
  assert.equal(body.reason, 'ungrounded')
  assert.equal(calls.length, 1)
})

test('the kill switch also disables OpenCode', async () => {
  delete process.env.OPENROUTER_API_KEY
  process.env.OPENCODE_API_KEY = 'oc'
  process.env.ASK_LLM = 'off'
  const res = await call('where are you based', '10.0.19.1')
  assert.equal(res.status, 503)
  assert.equal(calls.length, 0)
})

test('upstream failures are logged with provider host and status only, never keys or visitor text', async () => {
  process.env.OPENCODE_API_KEY = 'oc-secret-789'
  const warned: string[] = []
  const realWarn = console.warn
  console.warn = (...args: unknown[]) => {
    warned.push(args.map((a) => String(a)).join(' '))
  }
  try {
    upstream = () => new Response('{"error":"nope"}', { status: 401 })
    await call('where are you based', '10.0.20.1')
  } finally {
    console.warn = realWarn
  }
  const all = warned.join(' | ')
  assert.ok(/opencode\.ai/.test(all) && /401/.test(all), all)
  assert.ok(/openrouter\.ai/.test(all), 'second provider failure is logged too: ' + all)
  assert.ok(!all.includes('oc-secret-789') && !all.includes('test-key-123'), 'keys must never be logged')
  assert.ok(!/where are you based/i.test(all), 'visitor text must never be logged')
})

test.after(() => {
  globalThis.fetch = realFetch
})
