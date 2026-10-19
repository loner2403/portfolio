import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Mascot, { type Mood } from '@/components/ask/Mascot'
import Panel, { type Message } from '@/components/ask/Panel'
import { answer } from '@/lib/ask'
import { scrollToTarget } from '@/motion/bus'

const INITIAL = "I'm Probe. I answer from this site's own content, nothing else. Try one of these:"
const HINT = 'Ask me about the work.'
const OW = 'Ow. Ask me something instead.'
const SUGGESTIONS = answer('').suggestions
const IDLE_MS = 1500
const HINT_AFTER = 6000
const HINT_FOR = 5000
const SLEEP_AFTER = 25000
const CLICK_WINDOW = 1500
const SUBMIT_GAP = 400
const THINK_FOR = 450
const PHRASE_TIMEOUT = 8000
const SETTLE_FOR = 1800
const SCROLL_WINDOW = 400
const VEL_SMOOTH = 0.3
const SCROLL_Y_SCALE = 14
const SCROLL_Y_MAX = 18
const SCROLL_ROT_SCALE = 6
const SCROLL_ROT_MAX = 7
const SPRING_STIFF = 0.16
const SPRING_DAMP = 0.74
const SPRING_REST = 0.05
const GLANCE_VEL = 0.4
const GLANCE_LOOK = 2
const LOOK_RANGE = 2
const LOOK_SCALE = 80
const CANNOT_ANSWER = /\b(do not|don't|cannot|can't) (know|find|answer)\b/i

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

function readPhrased(data: unknown): string | null {
  if (typeof data !== 'object' || data === null || !('ok' in data) || data.ok !== true) return null
  if (!('text' in data) || typeof data.text !== 'string' || !data.text.trim()) return null
  return data.text
}

async function phrase(query: string, signal: AbortSignal): Promise<string | null> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  const timer = window.setTimeout(abort, PHRASE_TIMEOUT)
  signal.addEventListener('abort', abort)
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    })
    if (!response.ok) return null
    return readPhrased(await response.json())
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
    signal.removeEventListener('abort', abort)
  }
}

function hintSeen() {
  try {
    return window.sessionStorage.getItem('probe-hinted') === '1'
  } catch {
    return true
  }
}

function rememberHint() {
  try {
    window.sessionStorage.setItem('probe-hinted', '1')
  } catch {
    return
  }
}

export default function AskBot() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [mood, setMood] = useState<Mood>('idle')
  const [sleeping, setSleeping] = useState(false)
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: INITIAL, suggestions: SUGGESTIONS },
  ])
  const [bubble, setBubble] = useState<string | null>(null)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const botWrapRef = useRef<HTMLDivElement>(null)
  const botRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sleepingRef = useRef(false)
  const moodTimer = useRef(0)
  const request = useRef<AbortController | null>(null)
  const clicks = useRef({ count: 0, at: 0 })
  const lastSubmit = useRef(0)
  const nextId = useRef(1)

  const wake = useCallback(() => {
    if (!sleepingRef.current) return
    sleepingRef.current = false
    setSleeping(false)
  }, [])

  const flash = (next: Mood) => {
    window.clearTimeout(moodTimer.current)
    setMood(next)
    moodTimer.current = window.setTimeout(() => setMood('idle'), SETTLE_FOR)
  }

  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: IDLE_MS })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setReady(true), IDLE_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(moodTimer.current)
      request.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!ready || reducedMotion()) return
    if (botWrapRef.current) botWrapRef.current.style.transform = ''
    let frame = 0
    let lastTime = 0
    let lastY = window.scrollY
    let lastScroll = Number.NEGATIVE_INFINITY
    let vel = 0
    let yPos = 0
    let ySpeed = 0
    let rPos = 0
    let rSpeed = 0
    let glancing = false
    const tick = (now: number) => {
      frame = 0
      const dt = Math.max(1, now - lastTime)
      lastTime = now
      const active = now - lastScroll < SCROLL_WINDOW && document.visibilityState === 'visible'
      const raw = active ? (window.scrollY - lastY) / dt : 0
      lastY = window.scrollY
      vel += (raw - vel) * VEL_SMOOTH
      if (!active && Math.abs(vel) < SPRING_REST) vel = 0
      const targetY = open ? 0 : clamp(-vel * SCROLL_Y_SCALE, -SCROLL_Y_MAX, SCROLL_Y_MAX)
      const targetR = open ? 0 : clamp(vel * SCROLL_ROT_SCALE, -SCROLL_ROT_MAX, SCROLL_ROT_MAX)
      ySpeed += (targetY - yPos) * SPRING_STIFF
      ySpeed *= SPRING_DAMP
      yPos += ySpeed
      rSpeed += (targetR - rPos) * SPRING_STIFF
      rSpeed *= SPRING_DAMP
      rPos += rSpeed
      const resting =
        Math.abs(yPos) < SPRING_REST &&
        Math.abs(ySpeed) < SPRING_REST &&
        Math.abs(rPos) < SPRING_REST &&
        Math.abs(rSpeed) < SPRING_REST &&
        targetY === 0 &&
        targetR === 0
      if (resting) {
        yPos = 0
        ySpeed = 0
        rPos = 0
        rSpeed = 0
        vel = 0
      }
      if (botWrapRef.current) {
        botWrapRef.current.style.transform = resting
          ? ''
          : `translate3d(0, ${yPos.toFixed(2)}px, 0) rotate(${rPos.toFixed(2)}deg)`
      }
      if (Math.abs(vel) > GLANCE_VEL) {
        const lookY = vel > 0 ? GLANCE_LOOK : -GLANCE_LOOK
        setLook((prev) => (prev.x === 0 && prev.y === lookY ? prev : { x: 0, y: lookY }))
        glancing = true
      } else if (glancing) {
        glancing = false
        setLook((prev) => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }))
      }
      if (active || !resting) frame = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      lastScroll = performance.now()
      if (!frame) {
        lastTime = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ready, open])

  useEffect(() => {
    if (!ready || reducedMotion()) return
    let frame = 0
    let px = 0
    let py = 0
    const update = () => {
      frame = 0
      const rect = botRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp((px - rect.left - rect.width / 2) / LOOK_SCALE, -LOOK_RANGE, LOOK_RANGE)
      const y = clamp((py - rect.top - rect.height / 2) / LOOK_SCALE, -LOOK_RANGE, LOOK_RANGE)
      setLook((prev) => (prev.x === x && prev.y === y ? prev : { x, y }))
    }
    const onMove = (event: PointerEvent) => {
      px = event.clientX
      py = event.clientY
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [ready])

  useEffect(() => {
    if (!ready) return
    if (open) {
      wake()
      return
    }
    let timer = 0
    const arm = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        sleepingRef.current = true
        setSleeping(true)
      }, SLEEP_AFTER)
    }
    const onActivity = () => {
      wake()
      arm()
    }
    arm()
    window.addEventListener('pointermove', onActivity, { passive: true })
    window.addEventListener('scroll', onActivity, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointermove', onActivity)
      window.removeEventListener('scroll', onActivity)
    }
  }, [ready, open, wake])

  useEffect(() => {
    if (!ready || open || hintSeen()) return
    const timer = window.setTimeout(() => {
      rememberHint()
      setBubble(HINT)
    }, HINT_AFTER)
    return () => window.clearTimeout(timer)
  }, [ready, open])

  useEffect(() => {
    if (bubble === null) return
    const timer = window.setTimeout(() => setBubble(null), HINT_FOR)
    return () => window.clearTimeout(timer)
  }, [bubble])

  useEffect(() => {
    if (!ready) return
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'KeyA' || !event.altKey || isTyping(event.target)) return
      event.preventDefault()
      setOpen((current) => !current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready])

  useEffect(() => {
    const onOpenProbe = () => {
      setReady(true)
      setOpen(true)
    }
    window.addEventListener('open-probe', onOpenProbe)
    return () => window.removeEventListener('open-probe', onOpenProbe)
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      botRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const submit = (raw: string) => {
    const query = raw.trim()
    const now = performance.now()
    if (!query || now - lastSubmit.current < SUBMIT_GAP) return
    lastSubmit.current = now
    wake()
    const userId = nextId.current++
    setDraft('')
    setMessages((list) => [...list, { id: userId, role: 'user', text: query }])
    window.clearTimeout(moodTimer.current)
    setMood('thinking')
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    const result = answer(query)
    const phrased = result.grounded ? phrase(query, controller.signal) : Promise.resolve(null)
    Promise.all([wait(THINK_FOR), phrased]).then(([, text]) => {
      if (controller.signal.aborted) return
      const botId = nextId.current++
      const replyText = text ?? result.text
      const askable = !result.grounded || CANNOT_ANSWER.test(replyText)
      setMessages((list) => [
        ...list,
        {
          id: botId,
          role: 'bot',
          text: replyText,
          grounded: result.grounded,
          phrased: text !== null,
          sources: result.sources,
          suggestions: result.grounded ? undefined : result.suggestions,
          askable: askable ? query : undefined,
        },
      ])
      flash(result.grounded ? 'happy' : 'confused')
    })
  }

  const onBotClick = () => {
    wake()
    const now = performance.now()
    const count = now - clicks.current.at < CLICK_WINDOW ? clicks.current.count + 1 : 1
    clicks.current = { count, at: now }
    if (count >= 3) {
      clicks.current = { count: 0, at: 0 }
      setBubble(OW)
      flash('poked')
      return
    }
    if (!open) flash('poked')
    setBubble(null)
    setOpen(!open)
  }

  const close = () => {
    setOpen(false)
    botRef.current?.focus()
  }

  const openSource = (anchor: string) => {
    setOpen(false)
    if (anchor.startsWith('/')) {
      navigate(anchor)
      return
    }
    if (!anchor.startsWith('#')) return
    const id = anchor.slice(1)
    if (pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    const target = document.getElementById(id)
    if (target) scrollToTarget(target)
    window.history.replaceState(null, '', `#${id}`)
  }

  if (!ready) return null

  const engaged = focused || draft.length > 0
  const shown: Mood =
    mood !== 'idle' ? mood : open ? (engaged ? 'listening' : 'idle') : sleeping ? 'sleep' : 'idle'

  return (
    <div className="probe-dock-offset fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6">
      <div className="relative">
        {open && (
          <Panel
            messages={messages}
            draft={draft}
            inputRef={inputRef}
            onDraft={setDraft}
            onSubmit={submit}
            onSource={openSource}
            onClose={close}
            onFocusChange={setFocused}
          />
        )}
        {bubble !== null && !open && (
          <div className="probe-msg-in absolute right-full bottom-2 mr-3 border border-line bg-panel px-3 py-2 font-mono text-[11px] whitespace-nowrap text-ink">
            {bubble}
          </div>
        )}
        <div ref={botWrapRef} className="inline-block">
          <button
            ref={botRef}
            type="button"
            aria-label="Ask the site"
            aria-expanded={open}
            onClick={onBotClick}
            className="probe-float block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            <Mascot mood={shown} look={look} />
          </button>
        </div>
      </div>
    </div>
  )
}
