import type { gsap as GsapType } from 'gsap'
import type { Story, StoryEl, StoryLayout, StoryVerb } from '@/lib/stories'

type Gsap = typeof GsapType

export interface StoryTimeline {
  intro(): Promise<void>
  play(): void
  pause(): void
  kill(): void
}

const INTRO_VERBS: StoryVerb[] = ['in', 'draw', 'pop', 'type', 'grow']

export function buildTimeline(gsap: Gsap, svg: SVGSVGElement, story: Story): StoryTimeline {
  const layout: StoryLayout = svg.dataset.layout === 'wide' ? story.wide : story.tall
  const byId = new Map<string, StoryEl>(layout.els.map((el) => [el.id, el]))
  const node = (id: string) => svg.querySelector<SVGGraphicsElement>(`[data-sid="${id}"]`)
  const ctx = gsap.context(() => {}, svg)
  let tl!: ReturnType<Gsap['timeline']>
  let fade: ReturnType<Gsap['to']> | undefined

  try {
    ctx.add(() => {
      tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })

      for (const step of story.steps) {
        const g = node(step.target)
        if (!g) throw new Error(`story ${story.id}: missing target ${step.target}`)
        const el = byId.get(step.target)
        const at = step.at
        const dur = step.dur

        switch (step.do) {
          case 'in': {
            const rows = g.querySelectorAll('[data-row]')
            if (rows.length) {
              tl.set(g, { opacity: 1 }, at)
              tl.fromTo(rows, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: step.stagger ?? 0.1 }, at)
            } else {
              tl.fromTo(g, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, at)
            }
            break
          }
          case 'draw': {
            const path = g.querySelector<SVGPathElement>('path')
            if (el?.kind === 'path' && !el.dashed && path) {
              tl.set(g, { opacity: 1 }, at)
              tl.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur ?? 0.5, ease: 'power1.inOut' }, at)
            } else {
              const target = path ?? g.querySelector('rect') ?? g
              if (target !== g) tl.set(g, { opacity: 1 }, at)
              tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at)
            }
            break
          }
          case 'move': {
            const circle = g.querySelector('circle')
            const along = el?.kind === 'token' ? el.along : ''
            const route = node(along)?.querySelector<SVGPathElement>('path')
            if (!circle || !route) throw new Error(`story ${story.id}: bad token ${step.target}`)
            const len = route.getTotalLength()
            tl.set(g, { opacity: 1 }, at)
            const proxy = { t: 0 }
            tl.fromTo(
              proxy,
              { t: 0 },
              {
                t: 1,
                duration: dur ?? 0.6,
                ease: 'none',
                onStart: () => {
                  gsap.set(circle, { opacity: 1 })
                },
                onUpdate: () => {
                  const p = route.getPointAtLength(proxy.t * len)
                  gsap.set(circle, { x: p.x, y: p.y })
                },
                onComplete: () => {
                  gsap.set(circle, { opacity: 0 })
                },
              },
              at,
            )
            break
          }
          case 'flash': {
            const overlay = g.querySelectorAll('.st-flash')
            tl.set(g, { opacity: 1 }, at)
            tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at)
            tl.to(overlay, { opacity: 0, duration: 0.3 }, at + 0.2)
            break
          }
          case 'pop': {
            tl.fromTo(g, { opacity: 0, scale: 0.6, transformOrigin: 'center center' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, at)
            break
          }
          case 'out': {
            tl.to(g, { opacity: 0, duration: 0.2 }, at)
            break
          }
          case 'grow': {
            const bars = g.querySelectorAll('[data-bar]')
            tl.set(g, { opacity: 1 }, at)
            if (bars.length) {
              tl.fromTo(bars, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.5, stagger: 0.08 }, at)
            } else {
              tl.fromTo(g.querySelectorAll('[data-fill]'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: dur ?? 1, ease: 'power1.inOut' }, at)
            }
            break
          }
          case 'type': {
            tl.set(g, { opacity: 1 }, at)
            tl.fromTo(g, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'none' }, at)
            break
          }
          case 'spin': {
            const hand = g.querySelector('[data-hand]')
            if (el?.kind !== 'clock' || !hand) throw new Error(`story ${story.id}: bad clock ${step.target}`)
            tl.set(g, { opacity: 1 }, at)
            tl.fromTo(hand, { rotation: 0, svgOrigin: `${el.cx} ${el.cy}` }, { rotation: 360, duration: dur ?? 1, ease: 'power2.inOut' }, at)
            break
          }
          case 'sweep': {
            const scan = g.querySelector('[data-scan]')
            if (el?.kind !== 'scan' || !scan) throw new Error(`story ${story.id}: bad scan ${step.target}`)
            const span = dur ?? 1
            tl.set(g, { opacity: 1 }, at)
            tl.fromTo(scan, { y: 0, opacity: 0.85 }, { y: el.h - 2, duration: span, ease: 'power1.inOut' }, at)
            tl.to(scan, { opacity: 0, duration: 0.2 }, at + span)
            break
          }
        }
      }

      for (const el of layout.els) {
        if ((el.kind === 'stamp' || el.kind === 'text') && el.final === false) {
          const g = node(el.id)
          if (g) tl.set(g, { opacity: 0 }, 0)
        }
      }
    })
  } catch (err) {
    ctx.revert()
    throw err
  }

  const first = new Map<string, StoryVerb>()
  for (const step of [...story.steps].sort((a, b) => a.at - b.at)) {
    if (!first.has(step.target)) first.set(step.target, step.do)
  }
  const introIds = new Set<string>()
  for (const [id, verb] of first) {
    if (INTRO_VERBS.includes(verb)) introIds.add(id)
  }
  for (const el of layout.els) {
    if ((el.kind === 'stamp' || el.kind === 'text') && el.final === false) introIds.add(el.id)
  }
  const introTargets = [...introIds]
    .map((id) => node(id))
    .filter((n): n is SVGGraphicsElement => n !== null)

  return {
    intro: () =>
      new Promise<void>((resolve) => {
        const finish = () => {
          tl.progress(0)
          resolve()
        }
        if (!introTargets.length) {
          finish()
          return
        }
        fade = gsap.to(introTargets, { opacity: 0, duration: 0.25, onComplete: finish })
      }),
    play: () => {
      tl.play()
    },
    pause: () => {
      tl.pause()
    },
    kill: () => {
      fade?.kill()
      tl.kill()
      ctx.revert()
    },
  }
}
