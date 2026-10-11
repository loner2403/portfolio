const ENDPOINT = 'https://api.telegram.org'
const TIMEOUT_MS = 5000
const WINDOW_MS = 600_000
const MAX_PER_WINDOW = 3
const MAX_KEYS = 5000
const MAX_QUESTION = 200
const MAX_EMAIL = 254
const MAX_PAGE = 100

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const requests = new Map<string, number[]>()

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

function clientKey(request: Request): string {
  const first = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return first ? first : 'unknown'
}

function prune(now: number) {
  for (const [key, times] of requests) {
    if (times.every((at) => now - at >= WINDOW_MS)) requests.delete(key)
  }
  while (requests.size > MAX_KEYS) {
    const oldest = requests.keys().next().value
    if (oldest === undefined) break
    requests.delete(oldest)
  }
}

function allow(key: string, now: number): boolean {
  const recent = (requests.get(key) ?? []).filter((at) => now - at < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    requests.set(key, recent)
    return false
  }
  recent.push(now)
  requests.set(key, recent)
  if (requests.size > MAX_KEYS) prune(now)
  return true
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return null
  }
  if (typeof body !== 'object' || body === null) return null
  return body as Record<string, unknown>
}

function cleanQuestion(value: string): string {
  const spaced = value.replace(/\r\n|\n|\r/g, ' ')
  let cleaned = ''
  for (const char of spaced) {
    const code = char.codePointAt(0) ?? 0
    if (code > 0x1f && code !== 0x7f) cleaned += char
  }
  return cleaned.replace(/ +/g, ' ').trim()
}

type Message = { question: string; email: string | null; page: string }

type Parsed = { kind: 'ok'; message: Message } | { kind: 'error'; reason: 'bad-request' | 'bad-email' }

function parse(body: Record<string, unknown>): Parsed {
  if (typeof body.question !== 'string') return { kind: 'error', reason: 'bad-request' }
  const question = cleanQuestion(body.question)
  if (!question || question.length > MAX_QUESTION) return { kind: 'error', reason: 'bad-request' }

  let email: string | null = null
  if (body.email !== undefined && body.email !== null) {
    if (typeof body.email !== 'string') return { kind: 'error', reason: 'bad-request' }
    const trimmed = body.email.trim()
    if (trimmed !== '') {
      if (trimmed.length > MAX_EMAIL || !EMAIL_PATTERN.test(trimmed)) {
        return { kind: 'error', reason: 'bad-email' }
      }
      email = trimmed
    }
  }

  let page = 'unknown'
  if (
    typeof body.page === 'string' &&
    body.page.startsWith('/') &&
    !body.page.startsWith('//') &&
    body.page.length <= MAX_PAGE
  ) {
    page = body.page
  }

  return { kind: 'ok', message: { question, email, page } }
}

function messageText(message: Message): string {
  return [
    'Probe: unanswered question',
    `Q: ${message.question}`,
    `Email: ${message.email ?? 'none'}`,
    `Page: ${message.page}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n')
}

async function send(token: string, chatId: string, text: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(`${ENDPOINT}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        link_preview_options: { is_disabled: true },
      }),
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return json({ ok: false, reason: 'disabled' }, 503)
  }
  if (!allow(clientKey(request), Date.now())) {
    return json({ ok: false, reason: 'rate-limit' }, 429)
  }
  const body = await readBody(request)
  if (body === null) {
    return json({ ok: false, reason: 'bad-request' }, 400)
  }
  if (typeof body.website === 'string' && body.website !== '') {
    return json({ ok: true })
  }
  const parsed = parse(body)
  if (parsed.kind === 'error') {
    return json({ ok: false, reason: parsed.reason }, 400)
  }
  const ok = await send(token, chatId, messageText(parsed.message))
  if (!ok) {
    return json({ ok: false, reason: 'upstream' }, 502)
  }
  return json({ ok: true })
}
