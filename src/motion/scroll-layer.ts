import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { scrollToTarget, setScroller } from './bus'
import { shouldPreventSmoothScroll } from './prevent'
import { magneticOffset } from './magnetic'
import { followX } from './follow'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

let scenesRevert: (() => void) | null = null

function mountScenes(): () => void {
  const mm = gsap.matchMedia()

  try {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const addedIn: HTMLElement[] = []
      const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]')

      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add('is-in')
          addedIn.push(el)
        }
      })

      document.documentElement.classList.add('motion-ready')

      ScrollTrigger.batch('[data-reveal]:not(.is-in)', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
            onComplete: () =>
              batch.forEach((el) => {
                const node = el as HTMLElement
                node.classList.add('is-in')
                gsap.set(node, { clearProps: 'clipPath,opacity,transform' })
              }),
          }),
      })

      document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) return
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: 'power4.out',
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            }),
        })
      })

      document.querySelectorAll<HTMLElement>('section[id]').forEach((section) => {
        const links = document.querySelectorAll<HTMLElement>(`header a[href="#${section.id}"]`)
        if (links.length === 0) return
        const marker = section.querySelector('.rail-marker')
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            links.forEach((link) => link.toggleAttribute('data-active', self.isActive))
            marker?.classList.toggle('is-active', self.isActive)
          },
        })
      })

      const underlines = Array.from(
        document.querySelectorAll<HTMLElement>('[data-underline]'),
      )
      underlines.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add('is-in')
        }
        ScrollTrigger.create({
          trigger: el.closest('section') ?? el,
          start: 'top 90%',
          once: true,
          onEnter: () => el.classList.add('is-in'),
        })
      })

      const hairlines = Array.from(
        document.querySelectorAll<HTMLElement>('[data-hairline]'),
      )
      hairlines.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add('is-in')
        }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => el.classList.add('is-in'),
        })
      })

      const cap = document.querySelector<HTMLElement>('#contact .rail-marker')
      if (cap) {
        ScrollTrigger.create({
          trigger: '#contact',
          start: 'top 55%',
          once: true,
          onEnter: () => cap.classList.add('is-pulse'),
        })
      }

      const watchdog = window.setTimeout(() => {
        const stranded = Array.from(
          document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'),
        ).filter((el) => el.getBoundingClientRect().top < 0)
        if (stranded.length === 0) return
        document.documentElement.classList.remove('motion-ready')
        stranded.forEach((el) => {
          el.classList.add('is-in')
          gsap.set(el, { clearProps: 'clipPath,opacity,transform' })
        })
      }, 6000)

      return () => {
        window.clearTimeout(watchdog)
        addedIn.forEach((el) => el.classList.remove('is-in'))
        underlines.forEach((el) => el.classList.remove('is-in'))
        hairlines.forEach((el) => el.classList.remove('is-in'))
        cap?.classList.remove('is-pulse')
        document.documentElement.classList.remove('motion-ready')
      }
    })

    mm.add(
      '(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)',
      () => {
        const cleanups: Array<() => void> = []

        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
          },
        })

        document.querySelectorAll<HTMLElement>('[data-testid="work-row"]').forEach((row) => {
          const card = row.querySelector<HTMLElement>('[data-work-preview]')
          if (!card) return
          gsap.set(card, { right: 'auto', left: 0, x: 0 })
          const xTo = gsap.quickTo(card, 'x', { duration: 0.35, ease: 'power3.out' })
          const place = (e: PointerEvent) => {
            const r = row.getBoundingClientRect()
            return followX(e.clientX, r.left, r.width, card.offsetWidth)
          }
          const onEnter = (e: PointerEvent) => {
            gsap.set(card, { x: place(e) })
          }
          const onMove = (e: PointerEvent) => xTo(place(e))
          row.addEventListener('pointerenter', onEnter)
          row.addEventListener('pointermove', onMove, { passive: true })
          cleanups.push(() => {
            row.removeEventListener('pointerenter', onEnter)
            row.removeEventListener('pointermove', onMove)
          })
        })

        const hero = document.getElementById('top')
        const words = gsap.utils.toArray<HTMLElement>('#top .word-mask')
        const sheet = document.querySelector<HTMLElement>('[data-hero-sheet]')
        if (hero && words.length > 0 && sheet) {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
          })
          tl.to(words, { yPercent: (i: number) => -(8 + i * 3) }, 0)
          tl.to(sheet, { y: -48, scale: 0.97, transformOrigin: '50% 100%' }, 0)
        }

        const dot = document.querySelector<HTMLElement>('[data-log-dot]')
        const rail = dot?.parentElement
        if (dot && rail) {
          gsap.fromTo(
            dot,
            { y: 0 },
            {
              y: () => Math.max(0, rail.offsetHeight - dot.offsetHeight),
              ease: 'none',
              scrollTrigger: {
                trigger: rail,
                start: 'top 55%',
                end: 'bottom 55%',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        }

        const el = document.querySelector<HTMLElement>('[data-magnetic]')
        if (el) {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' })
          const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' })

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            const reach = Math.max(r.width, r.height) / 2 + 60
            const rx = r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number)
            const ry = r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number)
            const o = magneticOffset(e.clientX - rx, e.clientY - ry, reach)
            xTo(o.x)
            yTo(o.y)
          }

          window.addEventListener('pointermove', onMove, { passive: true })
          cleanups.push(() => {
            window.removeEventListener('pointermove', onMove)
            gsap.set(el, { clearProps: 'transform' })
          })
        }

        return () => {
          cleanups.forEach((fn) => fn())
        }
      },
    )

    mm.add(
      '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-card')
        gsap.set(cards, { transformOrigin: '50% 0%' })
        cards.forEach((card, index) => {
          const next = cards[index + 1]
          if (!next) return
          const dim = card.querySelector<HTMLElement>('[data-stack-dim]')
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: next,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          })
          tl.to(card, { scale: 0.9 + index * 0.02 }, 0)
          if (dim) tl.to(dim, { opacity: 0.55 }, 0)
        })
      },
    )

    mm.add(
      '(prefers-reduced-motion: no-preference) and (max-width: 1023px)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-card')
        gsap.set(cards, { transformOrigin: '50% 0%' })
        cards.forEach((card, index) => {
          const next = cards[index + 1]
          if (!next) return
          const dim = card.querySelector<HTMLElement>('[data-stack-dim]')
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: next,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          })
          tl.to(card, { scale: 0.95 + index * 0.01 }, 0)
          if (dim) tl.to(dim, { opacity: 0.3 }, 0)
        })
      },
    )
  } catch (error) {
    document.documentElement.classList.remove('motion-ready')
    console.error(error)
    mm.revert()
    return () => {}
  }

  return () => mm.revert()
}

export function refresh(): void {
  if (!scenesRevert) {
    ScrollTrigger.refresh()
    return
  }
  scenesRevert()
  scenesRevert = mountScenes()
  ScrollTrigger.refresh()
}

export default function start(): () => void {
  const lenisMm = gsap.matchMedia()

  lenisMm.add(
    '(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)',
    () => {
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        prevent: shouldPreventSmoothScroll,
      })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      setScroller({
        scrollTo: (target, offset = 0) => lenis.scrollTo(target, { offset }),
        scrollTop: () => lenis.scrollTo(0, { immediate: true }),
      })

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const anchor = (event.target as Element | null)?.closest('a[href^="#"]')
        const hash = anchor?.getAttribute('href')
        if (!hash || hash === '#') return
        const target = document.getElementById(hash.slice(1))
        if (!target) return
        event.preventDefault()
        scrollToTarget(target)
        window.history.replaceState(null, '', hash)
      }
      document.addEventListener('click', onClick)

      return () => {
        document.removeEventListener('click', onClick)
        gsap.ticker.remove(raf)
        lenis.destroy()
        setScroller(null)
      }
    },
  )

  scenesRevert = mountScenes()

  ScrollTrigger.config({ ignoreMobileResize: true })
  document.fonts.ready.then(() => ScrollTrigger.refresh())

  return () => {
    scenesRevert?.()
    scenesRevert = null
    lenisMm.revert()
  }
}
