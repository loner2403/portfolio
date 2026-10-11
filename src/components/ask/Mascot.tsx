export type Mood = 'idle' | 'listening' | 'thinking' | 'happy' | 'confused' | 'poked' | 'sleep'

interface MascotProps {
  mood: Mood
  look: { x: number; y: number }
}

function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'happy') {
    return (
      <g className="stroke-ink" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20L14.5 16.5L18 20" />
        <path d="M26 20L29.5 16.5L33 20" />
      </g>
    )
  }
  if (mood === 'poked' || mood === 'sleep') {
    return (
      <g className="fill-ink">
        <rect x="13" y="19" width="3" height="1" />
        <rect x="28" y="19" width="3" height="1" />
      </g>
    )
  }
  const wide = mood === 'listening'
  const motion = mood === 'idle' ? 'probe-blink' : mood === 'thinking' ? 'probe-dart' : ''
  const height = wide ? 6 : 5
  return (
    <g className={motion}>
      <rect
        x={wide ? 12.5 : 13}
        y={wide ? 17 : 16}
        width={wide ? 4 : 3}
        height={height}
        className="fill-ink"
      />
      <rect
        x={wide ? 27.5 : 28}
        y={wide ? 17 : 16}
        width={wide ? 4 : 3}
        height={mood === 'confused' ? 3 : height}
        className="fill-ink"
      />
    </g>
  )
}

function Mouth({ mood }: { mood: Mood }) {
  const d =
    mood === 'happy'
      ? 'M16 30Q22 35 28 30'
      : mood === 'confused'
        ? 'M15 31q1.75-2 3.5 0t3.5 0t3.5 0t3.5 0'
        : mood === 'thinking'
          ? 'M18 31H26'
          : 'M17 31H27'
  return (
    <path
      d={d}
      className="stroke-ink"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

export default function Mascot({ mood, look }: MascotProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      focusable="false"
      className={`block h-11 w-11 overflow-visible max-sm:h-10 max-sm:w-10 ${mood === 'poked' ? 'probe-hop' : ''}`}
    >
      <g
        className={mood === 'confused' ? 'motion-safe:rotate-[6deg]' : ''}
        style={{ transformOrigin: '22px 22px' }}
      >
        <rect x="0.5" y="0.5" width="43" height="43" rx="2" className="fill-panel-2 stroke-line" />
        <rect
          x="21"
          y="-6"
          width="2"
          height="6"
          className={mood === 'happy' ? 'fill-signal probe-flash' : 'fill-signal'}
        />
        <g style={{ transform: `translate(${look.x}px, ${look.y}px)` }}>
          <Eyes mood={mood} />
        </g>
        <Mouth mood={mood} />
      </g>
      {mood === 'sleep' && (
        <text x="38" y="-2" fontSize="9" className="probe-zzz font-mono fill-muted">
          z
        </text>
      )}
    </svg>
  )
}
