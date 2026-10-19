import { useEffect, useState } from 'react'
import { formatClock } from '@/lib/clock'
import { GENERAL_INFO } from '@/lib/data'

export default function StatusClock() {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined

    const update = () => setTime(formatClock(new Date(), GENERAL_INFO.timezone))

    const stop = () => {
      if (interval !== undefined) {
        clearInterval(interval)
        interval = undefined
      }
    }

    const start = () => {
      if (interval === undefined) {
        update()
        interval = setInterval(update, 30000)
      }
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <span className="tabular-nums">
      {time} <span className="text-faint">IST</span>
    </span>
  )
}
