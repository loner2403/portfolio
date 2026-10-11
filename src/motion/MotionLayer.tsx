import { useEffect } from 'react'
import { setRefresher } from './bus'

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export default function MotionLayer() {
  useEffect(() => {
    const idleWindow = window as IdleWindow
    let cancelled = false
    let teardown: (() => void) | null = null
    let handle: number | null = null

    const startLayer = () => {
      import('./scroll-layer').then((mod) => {
        if (cancelled) return
        teardown = mod.default()
        setRefresher(mod.refresh)
      })
    }

    const schedule = () => {
      if (idleWindow.requestIdleCallback) {
        handle = idleWindow.requestIdleCallback(startLayer, { timeout: 1200 })
      } else {
        handle = window.setTimeout(startLayer, 300)
      }
    }

    const onLoad = () => schedule()

    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', onLoad)
      if (handle !== null) {
        if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(handle)
        else window.clearTimeout(handle)
      }
      teardown?.()
      setRefresher(null)
    }
  }, [])

  return null
}
