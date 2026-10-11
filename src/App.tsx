import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import CommandPalette from '@/components/CommandPalette'
import MotionLayer from '@/motion/MotionLayer'
import { refreshScenes, scrollToTop } from '@/motion/bus'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const AskBot = lazy(() => import('@/components/ask/AskBot'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current === pathname && !hash) scrollToTop()
    prevPath.current = pathname
  }, [pathname, hash])

  return null
}

function RouteLine() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setRun((n) => n + 1)
  }, [pathname])

  if (run === 0 || reduced) return null

  return (
    <m.div
      key={run}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-[60] h-0.5 origin-left bg-signal"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{
        scaleX: 1,
        opacity: 0,
        transition: {
          scaleX: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          opacity: { delay: 0.35, duration: 0.2, ease: 'linear' },
        },
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

function App() {
  const location = useLocation()
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

  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:border focus-visible:border-signal focus-visible:bg-bg focus-visible:px-3 focus-visible:py-2 focus-visible:font-mono focus-visible:text-sm focus-visible:text-ink">Skip to content</a>
      <ScrollManager />
      <MotionLayer />
      <SiteHeader />
      <RouteLine />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (!window.location.hash) scrollToTop()
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
      <CommandPalette />
      <Suspense fallback={null}>
        <AskBot />
      </Suspense>
      <Analytics />
    </>
  )
}

export default App
