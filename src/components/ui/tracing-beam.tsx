import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

const GRADIENT_START = '#FFE899'
const GRADIENT_STOP = '#FFCE94'
const TRACK_COLOR = '#2F3A33'

export const TracingBeam = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  const reduced = useReducedMotion() ?? false
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const update = () => setSvgHeight(el.offsetHeight)
    update()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  })
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, Math.max(svgHeight - 200, 0)]), {
    stiffness: 500,
    damping: 90,
  })

  const pathD = `M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`

  return (
    <m.div ref={ref} className={cn('relative w-full', className)}>
      <div className="absolute left-0 top-0 hidden md:block">
        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-line bg-panel">
          <span className="h-2 w-2 rounded-full bg-signal" />
        </div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="block"
          aria-hidden="true"
        >
          <path d={pathD} fill="none" stroke={TRACK_COLOR} />
          {!reduced && (
            <m.path
              d={pathD}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="2"
            />
          )}
          <defs>
            <m.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor={GRADIENT_START} stopOpacity="0" />
              <stop stopColor={GRADIENT_START} />
              <stop offset="0.325" stopColor={GRADIENT_STOP} />
              <stop offset="1" stopColor={GRADIENT_STOP} stopOpacity="0" />
            </m.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef} className="border-l border-line pl-5 md:border-l-0 md:pl-12">
        {children}
      </div>
    </m.div>
  )
}
