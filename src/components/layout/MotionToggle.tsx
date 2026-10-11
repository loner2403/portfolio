import { useEffect, useState } from 'react'
import { applyMotionPref, readMotionPref, writeMotionPref, type MotionPref } from '@/lib/motion-pref'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

export default function MotionToggle() {
  const [pref, setPref] = useState<MotionPref>('on')
  const paused = pref === 'paused'

  useEffect(() => {
    setPref(readMotionPref(getStorage()))
  }, [])

  function toggle() {
    const next: MotionPref = paused ? 'on' : 'paused'
    setPref(next)
    writeMotionPref(next, getStorage())
    applyMotionPref(next, document.documentElement)
  }

  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={toggle}
      className="font-mono text-xs text-muted transition-colors hover:text-ink underline-offset-4 hover:underline"
    >
      {paused ? 'Resume motion' : 'Pause motion'}
    </button>
  )
}
