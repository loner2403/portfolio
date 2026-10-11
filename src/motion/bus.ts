type Scroller = {
  scrollTo: (target: HTMLElement, offset?: number) => void
  scrollTop?: () => void
}

let scroller: Scroller | null = null

export function setScroller(next: Scroller | null): void {
  scroller = next
}

let refresher: (() => void) | null = null

export function setRefresher(next: (() => void) | null): void {
  refresher = next
}

export function refreshScenes(): void {
  refresher?.()
}

export function scrollToTarget(target: HTMLElement, instant = false): void {
  if (scroller && !instant) {
    scroller.scrollTo(target, 0)
    return
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (instant) {
    target.scrollIntoView({ behavior: 'instant' })
    return
  }
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

export function isSmoothScrollActive(): boolean {
  return scroller !== null
}

export function scrollToTop(): void {
  if (scroller?.scrollTop) {
    scroller.scrollTop()
    return
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}
