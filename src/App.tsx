import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import MobileDock from '@/components/layout/MobileDock'
import MotionLayer from '@/motion/MotionLayer'
import { refreshScenes, scrollToTop } from '@/motion/bus'
import { cn } from '@/lib/utils'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const SystemPage = lazy(() => import('@/pages/SystemPage'))
const AskBot = lazy(() => import('@/components/ask/AskBot'))
const CommandPalette = lazy(() => import('@/components/CommandPalette'))

const SCROLL_KEY = 'scroll:'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current === pathname && !hash) scrollToTop()
    prevPath.current = pathname
  }, [pathname, hash])

  return null
}

function ScrollMemory() {
  const { pathname } = useLocation()
  useEffect(
    () => () => {
      try {
        sessionStorage.setItem(SCROLL_KEY + pathname, String(window.scrollY))
      } catch {
        return
      }
    },
    [pathname],
  )
  return null
}

function readScroll(pathname: string): number | null {
  try {
    const value = sessionStorage.getItem(SCROLL_KEY + pathname)
    return value === null ? null : Number(value)
  } catch {
    return null
  }
}

function RouteWipe() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const stateRef = useRef(location.state)
  stateRef.current = location.state
  const [run, setRun] = useState(0)
  const [colour, setColour] = useState<string | null>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const wipe = (stateRef.current as { wipe?: unknown } | null)?.wipe
    setColour(typeof wipe === 'string' ? wipe : null)
    setRun((n) => n + 1)
  }, [location.pathname])

  if (run === 0 || reduced) return null

  return (
    <m.div
      key={run}
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-[65]', !colour && 'bg-signal')}
      style={colour ? { background: colour } : undefined}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{
        clipPath: [
          'inset(0 100% 0 0)',
          'inset(0 0% 0 0)',
          'inset(0 0% 0 100%)',
        ],
        transition: { duration: 0.7, times: [0, 0.45, 1], ease: [0.76, 0, 0.24, 1] },
      }}
    />
  )
}

function RouteReady() {
  useEffect(() => {
    const id = requestAnimationFrame(refreshScenes)
    return () => cancelAnimationFrame(id)
  }, [])

  return null
}

function LazyPalette() {
  const [wanted, setWanted] = useState(false)

  useEffect(() => {
    if (wanted) return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setWanted(true)
      }
    }
    const onOpen = () => setWanted(true)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [wanted])

  if (!wanted) return null
  return (
    <Suspense fallback={null}>
      <CommandPalette initialOpen />
    </Suspense>
  )
}

function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const desktop =
    typeof window === 'undefined' || window.matchMedia('(min-width: 1024px)').matches

  const transition = desktop
    ? {
        initial: { opacity: 0, y: 8 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: [0.215, 0.61, 0.355, 1] as const },
        },
        exit: {
          opacity: 0,
          y: -4,
          transition: { duration: 0.18, ease: [0.55, 0.085, 0.68, 0.53] as const },
        },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.1, ease: 'linear' as const } },
        exit: { opacity: 0, transition: { duration: 0.1, ease: 'linear' as const } },
      }

  useEffect(() => {
    document.documentElement.dataset.hydrated = '1'
  }, [])

  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:border focus-visible:border-signal focus-visible:bg-bg focus-visible:px-3 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:text-ink">Skip to content</a>
      <ScrollManager />
      <ScrollMemory />
      <MotionLayer />
      <SiteHeader />
      <RouteWipe />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (window.location.hash) return
          const saved = navigationType === 'POP' ? readScroll(location.pathname) : null
          if (saved !== null && Number.isFinite(saved)) {
            window.scrollTo({ top: saved, left: 0, behavior: 'instant' })
            return
          }
          scrollToTop()
        }}
      >
        <m.main key={location.pathname} id="main" tabIndex={-1} {...transition}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <RouteReady />
                </>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                  <ProjectPage />
                  <RouteReady />
                </Suspense>
              }
            />
            <Route
              path="/systems/:slug"
              element={
                <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                  <SystemPage />
                  <RouteReady />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <NotFound />
                  <RouteReady />
                </>
              }
            />
          </Routes>
        </m.main>
      </AnimatePresence>
      <SiteFooter />
      <MobileDock />
      <LazyPalette />
      <Suspense fallback={null}>
        <AskBot />
      </Suspense>
      <Analytics />
    </>
  )
}

export default App
