import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { STORIES, type Story, type StoryEl } from '@/lib/stories'
import { loadGsap } from '@/motion/load-gsap'
import { buildTimeline, type StoryTimeline } from './timeline'

function Node({ el }: { el: StoryEl }) {
  const hidden = (el.kind === 'stamp' || el.kind === 'text') && el.final === false
  const attrs = {
    'data-sid': el.id,
    'data-kind': el.kind,
    'data-anim': '',
    style: hidden ? { opacity: 0 } : undefined,
  }

  switch (el.kind) {
    case 'box':
      return (
        <g {...attrs} className="st-box">
          <rect className="st-shape" x={el.x} y={el.y} width={el.w} height={el.h} rx={3} />
          <rect className="st-flash" x={el.x} y={el.y} width={el.w} height={el.h} rx={3} />
          <text className="st-label" x={el.x + 10} y={el.y + 18}>
            {el.label}
          </text>
          {el.sub && (
            <text className="st-sub" x={el.x + 10} y={el.y + 32}>
              {el.sub}
            </text>
          )}
        </g>
      )
    case 'doc': {
      const { x, y, w, h } = el
      return (
        <g {...attrs} className="st-doc">
          <rect className="st-shape" x={x} y={y} width={w} height={h} />
          <rect className="st-flash" x={x} y={y} width={w} height={h} />
          <path className="st-path" d={`M${x + w - 12} ${y} L${x + w} ${y + 12}`} />
          {Array.from({ length: el.lines }, (_, i) => {
            const yy = y + 16 + i * ((h - 24) / Math.max(el.lines, 1))
            return <line key={i} className="st-docline" x1={x + 8} x2={x + w - 8} y1={yy} y2={yy} />
          })}
        </g>
      )
    }
    case 'region':
      return (
        <g {...attrs} className="st-region">
          <rect x={el.x} y={el.y} width={el.w} height={el.h} />
          <text x={el.x} y={el.y - 4}>
            {el.label}
          </text>
        </g>
      )
    case 'path':
      return (
        <g {...attrs}>
          <path className={cn('st-path', el.dashed && 'is-dashed')} d={el.d} pathLength={el.dashed ? undefined : 1} />
        </g>
      )
    case 'token':
      return (
        <g {...attrs}>
          <circle className="st-token" cx={0} cy={0} r={4.5} style={{ opacity: 0 }} />
        </g>
      )
    case 'stamp': {
      const { x, y } = el
      return (
        <g {...attrs}>
          <circle className={el.mark === 'check' ? 'st-stamp-check' : 'st-stamp-cross'} cx={x} cy={y} r={10} />
          {el.mark === 'check' ? (
            <path className="st-mark" d={`M${x - 4.5} ${y} l3 3 l6 -6`} />
          ) : (
            <path className="st-mark" d={`M${x - 4} ${y - 4} l8 8 M${x + 4} ${y - 4} l-8 8`} />
          )}
        </g>
      )
    }
    case 'bars': {
      const n = el.values.length
      const bw = (el.w - (n - 1) * 6) / n
      return (
        <g {...attrs}>
          {el.values.map((v, i) => (
            <rect
              key={i}
              className="st-bar"
              x={el.x + i * (bw + 6)}
              y={el.y + el.h - v * el.h}
              width={bw}
              height={v * el.h}
              data-bar=""
            />
          ))}
        </g>
      )
    }
    case 'rows':
      return (
        <g {...attrs}>
          {Array.from({ length: el.count }, (_, i) => (
            <rect
              key={i}
              className="st-row"
              x={el.x}
              y={el.y + i * el.rowH}
              width={el.w}
              height={el.rowH - 4}
              data-row=""
            />
          ))}
        </g>
      )
    case 'progress':
      return (
        <g {...attrs}>
          <rect className="st-track" x={el.x} y={el.y} width={el.w} height={el.h} />
          <rect className="st-fill" x={el.x} y={el.y} width={el.w} height={el.h} data-fill="" />
        </g>
      )
    case 'text':
      return (
        <g {...attrs}>
          <text
            className={cn('st-text', el.tone === 'muted' && 'is-muted', el.tone === 'accent' && 'is-accent')}
            x={el.x}
            y={el.y}
            fontSize={el.size ?? 10}
          >
            {el.content}
          </text>
        </g>
      )
    case 'clock': {
      const { cx, cy, r } = el
      return (
        <g {...attrs}>
          <circle className="st-clock" cx={cx} cy={cy} r={r} />
          <line className="st-path" x1={cx} y1={cy - r} x2={cx} y2={cy - r + 5} />
          <line className="st-hand" x1={cx} y1={cy} x2={cx} y2={cy - r + 8} data-hand="" />
        </g>
      )
    }
    case 'bubble':
      return (
        <g {...attrs}>
          <rect
            rx={10}
            className={el.side === 'right' ? 'st-bubble-right' : 'st-bubble-left'}
            x={el.x}
            y={el.y}
            width={el.w}
            height={el.h}
          />
          <text
            className={el.side === 'right' ? 'st-bubble-text-right' : 'st-bubble-text-left'}
            x={el.x + 12}
            y={el.y + el.h / 2 + 3.5}
          >
            {el.text}
          </text>
        </g>
      )
    case 'scan':
      return (
        <g {...attrs}>
          <rect className="st-scan" x={el.x} y={el.y} width={el.w} height={2} data-scan="" />
        </g>
      )
  }
}

function Layout({ story, layout, className }: { story: Story; layout: 'wide' | 'tall'; className?: string }) {
  const data = layout === 'wide' ? story.wide : story.tall
  return (
    <svg
      data-story={story.id}
      data-layout={layout}
      data-playing="false"
      viewBox={data.viewBox}
      role="img"
      aria-label={story.caption}
      preserveAspectRatio="xMidYMid meet"
      className={cn('story h-auto w-full', className)}
    >
      {data.els.map((el) => (
        <Node key={el.id} el={el} />
      ))}
    </svg>
  )
}

export default function StoryScene({ storyId, className }: { storyId: string; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const story = STORIES[storyId]
    if (!root || !story) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia('(min-width: 768px)')
    let stop: (() => void) | null = null

    const setup = (): (() => void) | null => {
      if (reduce.matches) return null
      const svg = root.querySelector<SVGSVGElement>(`svg[data-layout="${wide.matches ? 'wide' : 'tall'}"]`)
      if (!svg) return null

      let alive = true
      let ctl: StoryTimeline | null = null
      let ready = false
      let started = false
      let inView = false
      let interval: number | undefined

      const play = () => {
        if (!ctl || !ready || svg.dataset.playing === 'true') return
        ctl.play()
        svg.setAttribute('data-playing', 'true')
      }

      const pause = () => {
        if (!ctl || svg.dataset.playing !== 'true') return
        ctl.pause()
        svg.setAttribute('data-playing', 'false')
      }

      const tick = () => {
        if (!ctl || !ready) return
        const r = svg.getBoundingClientRect()
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        if (inView && !document.hidden && hit && svg.contains(hit)) play()
        else pause()
      }

      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1]
          if (!entry || !alive) return
          inView = entry.isIntersecting
          if (inView && interval === undefined) interval = window.setInterval(tick, 400)
          if (!inView && interval !== undefined) {
            window.clearInterval(interval)
            interval = undefined
          }
          if (inView && !started) {
            started = true
            loadGsap()
              .then((gsap) => {
                if (!alive) return
                let built: StoryTimeline
                try {
                  built = buildTimeline(gsap, svg, story)
                } catch {
                  return
                }
                ctl = built
                built.intro().then(() => {
                  if (!alive) return
                  ready = true
                  tick()
                })
              })
              .catch(() => {})
          }
          tick()
        },
        { threshold: 0.35 },
      )

      const onVisibility = () => tick()
      io.observe(svg)
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        alive = false
        io.disconnect()
        if (interval !== undefined) window.clearInterval(interval)
        document.removeEventListener('visibilitychange', onVisibility)
        ctl?.kill()
        ctl = null
        svg.setAttribute('data-playing', 'false')
      }
    }

    const restart = () => {
      stop?.()
      stop = setup()
    }

    reduce.addEventListener('change', restart)
    wide.addEventListener('change', restart)
    restart()

    return () => {
      reduce.removeEventListener('change', restart)
      wide.removeEventListener('change', restart)
      stop?.()
      stop = null
    }
  }, [storyId])

  const story = STORIES[storyId]
  if (!story) return null

  return (
    <div ref={rootRef} className={cn('relative', className)} data-story-root={storyId}>
      <Layout story={story} layout="wide" className="hidden md:block" />
      <Layout story={story} layout="tall" className="md:hidden mx-auto max-h-[min(36svh,300px)]" />
    </div>
  )
}
