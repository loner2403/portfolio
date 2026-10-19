import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import FlowGraph from '@/components/diagram/FlowGraph'
import { SYSTEMS } from '@/lib/data'
import { HERO_COMPACT, HERO_WALK_COMPACT, HERO_WALK_LABEL, HERO_WALK_WIDE, HERO_WIDE } from '@/lib/hero-graph'

const TOP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const SIDE_NUMBERS = ['1', '2', '3', '4', '5']

function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isCompact
}

export default function HeroSheet({
  activeId,
  onActiveChange,
}: {
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
}) {
  const prefersReduced = useReducedMotion() ?? false
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduced = mounted && prefersReduced
  const isCompact = useIsCompact()
  const [hovered, setHovered] = useState<string | null>(null)
  const [stopped, setStopped] = useState(false)
  const [isMac, setIsMac] = useState(false)

  const spec = isCompact ? HERO_COMPACT : HERO_WIDE

  const effective = hovered ?? activeId ?? null
  const isSystemKey = effective !== null && /^s0[1-5]$/.test(effective)
  const activeSystem = isSystemKey
    ? SYSTEMS.find((system) => system.id === `S-${effective.slice(1)}`)
    : undefined

  const handleActiveChange = (id: string | null) => {
    setHovered(id)
    if (id !== null) setStopped(true)
    onActiveChange?.(id)
  }

  const jumpHint = `press ${isMac ? '⌘K' : 'Ctrl K'} to jump anywhere`

  const infoLine = activeSystem
    ? [activeSystem.id, activeSystem.stages?.join(' → '), activeSystem.stack.join(' · ')]
        .filter(Boolean)
        .join(' · ')
    : reduced || stopped
      ? jumpHint
      : HERO_WALK_LABEL

  useEffect(() => {
    setIsMac(navigator.platform.includes('Mac'))
  }, [])

  useEffect(() => {
    const stop = () => setStopped(true)
    window.addEventListener('pointerdown', stop, { once: true })
    window.addEventListener('keydown', stop, { once: true })
    return () => {
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [])

  return (
    <div data-testid="flow-diagram" data-hero-sheet>
      <div className="sheet-in relative border border-line">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1.5 -top-1.5 h-2.5 w-2.5 border-l border-t border-faint"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1.5 -top-1.5 h-2.5 w-2.5 border-r border-t border-faint"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-2.5 w-2.5 border-b border-l border-faint"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-2.5 w-2.5 border-b border-r border-faint"
        />

        <div
          aria-hidden="true"
          className="grid-in pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(237,233,223,.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,233,223,.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          }}
        />

        {!isCompact && (
          <>
            <div
              aria-hidden="true"
              className="ruler-in pointer-events-none absolute inset-x-5 top-0 h-5"
            >
              <div className="flex h-full items-center justify-between">
                {TOP_LETTERS.map((letter) => (
                  <span key={letter} className="font-mono text-[10px] leading-none text-faint">
                    {letter}
                  </span>
                ))}
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to right, var(--color-faint) 0 1px, transparent 1px 32px)',
                }}
              />
            </div>
            <div
              aria-hidden="true"
              className="ruler-in pointer-events-none absolute inset-y-5 left-0 w-5"
            >
              <div className="flex h-full flex-col justify-between">
                {SIDE_NUMBERS.map((number) => (
                  <span key={number} className="font-mono text-[10px] leading-none text-faint">
                    {number}
                  </span>
                ))}
              </div>
              <div
                className="absolute right-0 top-0 bottom-0 w-1"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, var(--color-faint) 0 1px, transparent 1px 32px)',
                }}
              />
            </div>
          </>
        )}

        <div className={isCompact ? 'p-3' : 'pt-6 pb-8 pl-6 pr-3'}>
          <FlowGraph
            spec={spec}
            label="Simulated architecture of an AI and data platform"
            interactive
            entrance="plot"
            walk={isCompact ? HERO_WALK_COMPACT : HERO_WALK_WIDE}
            walkStopped={stopped}
            activeId={activeId}
            onActiveChange={handleActiveChange}
          />
        </div>

        <div className="block-in absolute bottom-0 right-0 hidden border border-line bg-bg px-3 py-2 font-mono text-[10px] leading-[1.5] sm:block">
          <div className="text-ink">AI & DATA PLATFORM</div>
          <div className="text-muted">REFERENCE TOPOLOGY</div>
          <div className="text-faint">simulated trace · illustrative timings</div>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 h-6 truncate font-mono text-xs text-faint">
        {infoLine}
      </p>
    </div>
  )
}
