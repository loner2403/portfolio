import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'
import { applyMotionPref, readMotionPref } from '@/lib/motion-pref'

const root = document.getElementById('root')!

let storage: Storage | undefined
try {
  storage = window.localStorage
} catch {
  storage = undefined
}

applyMotionPref(readMotionPref(storage), document.documentElement)

const element = (
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <App />
        </LazyMotion>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, element)
else createRoot(root).render(element)

if (typeof window !== 'undefined') {
  console.log(
    '%cOh hello, fellow nosy developer. The probe lives at /api/ask. Try Ctrl K.',
    'color: #FF7036',
  )
}
