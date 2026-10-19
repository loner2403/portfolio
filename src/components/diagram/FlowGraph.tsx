import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { GEdge, GNode, GraphSpec, Side } from '@/components/diagram/types'
import { NodeBadge } from '@/components/diagram/icons'
import { NodeFrame } from '@/components/diagram/frames'

const INTRO_MS = 900
const EDGE_STAGGER_MS = 90
const NODE_STAGGER_MS = 40
const PLOT_STAGGER_MS = 70
const PACKET_STAGGER_MS = 400

const NAME_CHAR_W = 7.4
const SUB_CHAR_W = 6.3
const LABEL_CHAR_W = 6.4
const LABEL_PAD = 14
const DIM_OPACITY = 0.3

const warnedNodes = new Set<string>()

interface Point {
  x: number
  y: number
}

interface PathDef {
  edge: GEdge
  d: string
  mid: Point
  chord: number
}

const OUT: Record<Side, Point> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
}

function nodeBox(node: GNode) {
  const w = node.w ?? 124
  const h = node.h ?? 40
  return { w, h, left: node.x - w / 2, top: node.y - h / 2 }
}

function anchor(node: GNode, side: Side, at?: Point): Point {
  if (at) return at
  const { w, h } = nodeBox(node)
  if (side === 'left') return { x: node.x - w / 2, y: node.y }
  if (side === 'right') return { x: node.x + w / 2, y: node.y }
  if (side === 'top') return { x: node.x, y: node.y - h / 2 }
  return { x: node.x, y: node.y + h / 2 }
}

function isHorizontal(side: Side): boolean {
  return side === 'left' || side === 'right'
}

function controlLength(side: Side, a: Point, b: Point): number {
  const delta = isHorizontal(side) ? b.x - a.x : b.y - a.y
  const floor = isHorizontal(side) ? 30 : 24
  return Math.max(floor, Math.abs(delta) * 0.5)
}

function buildPath(edge: GEdge, byId: Map<string, GNode>): PathDef {
  const from = byId.get(edge.from)
  const to = byId.get(edge.to)
  if (!from) throw new Error(`FlowGraph: missing node "${edge.from}" in edge ${edge.from} -> ${edge.to}`)
  if (!to) throw new Error(`FlowGraph: missing node "${edge.to}" in edge ${edge.from} -> ${edge.to}`)
  const a = anchor(from, edge.fromSide, edge.fromAt)
  const b = anchor(to, edge.toSide, edge.toAt)
  let c1: Point
  let c2: Point
  if (edge.curve) {
    c1 = { x: edge.curve[0], y: edge.curve[1] }
    c2 = { x: edge.curve[2], y: edge.curve[3] }
  } else {
    const o1 = OUT[edge.fromSide]
    const o2 = OUT[edge.toSide]
    const l1 = controlLength(edge.fromSide, a, b)
    const l2 = controlLength(edge.toSide, a, b)
    c1 = { x: a.x + o1.x * l1, y: a.y + o1.y * l1 }
    c2 = { x: b.x + o2.x * l2, y: b.y + o2.y * l2 }
  }
  const d = `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`
  const mid = {
    x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8,
    y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8,
  }
  const chord = Math.hypot(b.x - a.x, b.y - a.y)
  return { edge, d, mid, chord }
}

function warnIfOverflow(node: GNode) {
  if (!import.meta.env.DEV || warnedNodes.has(node.id) || node.kind === 'tag') return
  const w = node.w ?? 124
  const avail = w - 22
  const overflow: string[] = []
  if (node.name.length * NAME_CHAR_W > avail) overflow.push(`name "${node.name}"`)
  if (node.sub && node.sub.length * SUB_CHAR_W > avail) overflow.push(`sub "${node.sub}"`)
  if (overflow.length) {
    warnedNodes.add(node.id)
    console.warn(`FlowGraph: node "${node.id}" text overflows box: ${overflow.join(', ')}`)
  }
}

export default function FlowGraph({
  spec,
  label,
  className,
  interactive = false,
  activeId,
  onActiveChange,
  entrance = 'standard',
  pulses = false,
  walk,
  walkStopped = false,
}: {
  spec: GraphSpec
  label: string
  className?: string
  interactive?: boolean
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
  entrance?: 'standard' | 'plot'
  pulses?: boolean
  walk?: number[]
  walkStopped?: boolean
}) {
  const prefersReduced = useReducedMotion() ?? false
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduced = mounted && prefersReduced
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.3 })
  const live = useInView(ref, { amount: 0.1 })
  const [hidden, setHidden] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const arrowId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const active = activeId !== undefined ? hovered ?? activeId : hovered
  const highlight = interactive || (activeId !== undefined && activeId !== null)

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const running = live && !hidden
  const byId = new Map(spec.nodes.map((node) => [node.id, node]))
  const paths = spec.edges.map((edge) => buildPath(edge, byId))
  const flowDelay = (index: number) => INTRO_MS + index * EDGE_STAGGER_MS
  const packetDelay = (index: number) => INTRO_MS + index * PACKET_STAGGER_MS

  if (import.meta.env.DEV) spec.nodes.forEach(warnIfOverflow)

  const setNodeActive = (id: string | null) => {
    if (!interactive) return
    setHovered(id)
    onActiveChange?.(id)
  }

  const isEdgeActive = (edge: GEdge) =>
    highlight && active !== null && (edge.from === active || edge.to === active)
  const isEdgeDimmed = (edge: GEdge) => highlight && active !== null && !isEdgeActive(edge)

  const entranceClass = entrance === 'plot' ? 'node-plot' : 'node-in'
  const nodeStaggerMs = entrance === 'plot' ? PLOT_STAGGER_MS : NODE_STAGGER_MS

  return (
    <div
      ref={ref}
      data-running={running ? 'true' : 'false'}
      data-walk={walkStopped ? 'off' : 'on'}
      data-testid="flow-graph"
      className={className}
    >
      <svg viewBox={spec.viewBox} role="img" aria-label={label} className="h-auto w-full">
        <defs>
          <marker
            id={`arrow-${arrowId}`}
            markerUnits="userSpaceOnUse"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill="#5A625C" />
          </marker>
        </defs>

        {spec.groups?.map((group) => {
          const lane = group.tone === 'lane'
          return (
            <g
              key={group.id}
              style={{ opacity: reduced || seen ? 1 : 0, transition: 'opacity 520ms ease-out' }}
            >
              <rect
                x={group.x}
                y={group.y}
                width={group.w}
                height={group.h}
                rx={4}
                fill={lane ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.015)'}
                stroke={lane ? '#2E2620' : '#3A3128'}
                strokeWidth={1}
                strokeDasharray={lane ? undefined : '4 6'}
              />
              <text
                x={group.x + 14}
                y={group.y + (lane ? 22 : 20)}
                fill="var(--color-faint)"
                fontSize={10}
                fontFamily="var(--font-mono)"
                letterSpacing="0.1em"
              >
                {group.label.toUpperCase()}
              </text>
            </g>
          )
        })}

        {paths.map(({ edge, d }, index) => {
          const dashed = !!edge.dashed
          const dimmedEdge = isEdgeDimmed(edge)
          return (
            <path
              key={`base-${edge.from}-${edge.to}`}
              d={d}
              pathLength={dashed ? undefined : 1}
              className={cn(
                dashed ? 'edge-dashed' : 'edge-base',
                !dashed && !reduced && seen && 'edge-draw',
                highlight && isEdgeActive(edge) && 'edge-active',
              )}
              style={{
                opacity: dimmedEdge ? DIM_OPACITY : reduced || seen ? 1 : 0,
                ...(highlight ? { transition: 'opacity 120ms ease-out' } : {}),
                ...(reduced || !seen
                  ? {}
                  : {
                      animationDelay: `${index * EDGE_STAGGER_MS}ms`,
                      animationFillMode: 'backwards' as const,
                    }),
              }}
              markerEnd={dashed ? undefined : `url(#arrow-${arrowId})`}
            />
          )
        })}

        {paths.map(({ edge, d }, index) => {
          if (edge.dashed) return null
          if (reduced) {
            return (
              <path key={`flow-${edge.from}-${edge.to}`} d={d} aria-hidden="true" className="edge-flow-solid" />
            )
          }
          if (!seen) return null
          return (
            <path
              key={`flow-${edge.from}-${edge.to}`}
              d={d}
              aria-hidden="true"
              className="flow-dash"
              style={{ animationDelay: `${flowDelay(index)}ms` }}
            />
          )
        })}

        {!reduced &&
          seen &&
          (walk
            ? walk.map((edgeIndex, position) => {
                const path = paths[edgeIndex]
                if (!path) return null
                const { edge, d } = path
                const delay = INTRO_MS + position * 1400
                return (
                  <g key={`packet-walk-${edge.from}-${edge.to}`}>
                    <circle
                      r={3.5}
                      aria-hidden="true"
                      className="packet packet-walk"
                      style={
                        {
                          offsetPath: `path('${d}')`,
                          offsetRotate: '0deg',
                          animationDelay: `${delay}ms`,
                          '--o': 1,
                        } as CSSProperties
                      }
                    />
                    <circle
                      r={3}
                      aria-hidden="true"
                      className="packet packet-walk"
                      style={
                        {
                          offsetPath: `path('${d}')`,
                          offsetRotate: '0deg',
                          animationDelay: `${delay + 100}ms`,
                          '--o': 0.45,
                        } as CSSProperties
                      }
                    />
                    <circle
                      r={2.5}
                      aria-hidden="true"
                      className="packet packet-walk"
                      style={
                        {
                          offsetPath: `path('${d}')`,
                          offsetRotate: '0deg',
                          animationDelay: `${delay + 200}ms`,
                          '--o': 0.2,
                        } as CSSProperties
                      }
                    />
                  </g>
                )
              })
            : paths.map(({ edge, d }, index) => {
                if (!(edge.packet ?? !edge.dashed)) return null
                return (
                  <g key={`packet-${edge.from}-${edge.to}`}>
                    <circle
                      r={3.5}
                      aria-hidden="true"
                      className="packet"
                      style={{
                        offsetPath: `path('${d}')`,
                        offsetRotate: '0deg',
                        animationDelay: `${packetDelay(index)}ms`,
                      }}
                    />
                    <circle
                      r={3}
                      aria-hidden="true"
                      className="packet"
                      style={{
                        offsetPath: `path('${d}')`,
                        offsetRotate: '0deg',
                        opacity: 0.45,
                        animationDelay: `${packetDelay(index) + 100}ms`,
                      }}
                    />
                    <circle
                      r={2.5}
                      aria-hidden="true"
                      className="packet"
                      style={{
                        offsetPath: `path('${d}')`,
                        offsetRotate: '0deg',
                        opacity: 0.2,
                        animationDelay: `${packetDelay(index) + 200}ms`,
                      }}
                    />
                  </g>
                )
              }))}

        {pulses &&
          !walk &&
          !reduced &&
          seen &&
          paths.map(({ edge }, index) => {
            if (!(edge.packet ?? !edge.dashed)) return null
            const target = byId.get(edge.to)
            if (!target) return null
            const { w, h, left, top } = nodeBox(target)
            return (
              <rect
                key={`ring-${edge.from}-${edge.to}`}
                x={left - 3}
                y={top - 3}
                width={w + 6}
                height={h + 6}
                rx={3}
                fill="none"
                stroke="var(--color-signal)"
                className="node-ring"
                aria-hidden="true"
                style={{ animationDelay: `${packetDelay(index)}ms` }}
              />
            )
          })}

        {spec.nodes.map((node, index) => {
          const { w, h, left, top } = nodeBox(node)
          const isActiveNode = highlight && active === node.id
          const isDimNode = highlight && active !== null && active !== node.id
          const nodeClass = cn(!reduced && seen && entranceClass)
          const nodeStyle: CSSProperties = reduced
            ? {}
            : seen
              ? { animationDelay: `${index * nodeStaggerMs}ms` }
              : { opacity: 0 }
          if (isDimNode) nodeStyle.opacity = DIM_OPACITY
          if (highlight) nodeStyle.transition = 'opacity 120ms ease-out'

          const wrap = (children: ReactNode) =>
            node.href ? (
              <a
                href={node.href}
                className="graph-link"
                onFocus={() => setNodeActive(node.id)}
                onBlur={() => setNodeActive(null)}
              >
                {children}
              </a>
            ) : (
              children
            )

          if (node.kind === 'tag') {
            return (
              <g
                key={node.id}
                className={nodeClass}
                style={nodeStyle}
                onMouseEnter={() => setNodeActive(node.id)}
                onMouseLeave={() => setNodeActive(null)}
              >
                {wrap(
                  <>
                    <rect x={node.x} y={node.y - 4} width={4} height={4} fill="var(--color-faint)" />
                    <text
                      x={node.x + 10}
                      y={node.y}
                      dominantBaseline="middle"
                      fill="var(--color-muted)"
                      fontSize={11}
                      fontFamily="var(--font-mono)"
                    >
                      {node.name}
                    </text>
                  </>,
                )}
              </g>
            )
          }

          if (node.kind === 'ext') {
            return (
              <g
                key={node.id}
                className={nodeClass}
                style={nodeStyle}
                onMouseEnter={() => setNodeActive(node.id)}
                onMouseLeave={() => setNodeActive(null)}
              >
                {wrap(
                  <>
                    <rect
                      x={left}
                      y={top}
                      width={w}
                      height={h}
                      rx={2}
                      fill="none"
                      stroke={isActiveNode ? 'var(--color-signal)' : '#3C4A41'}
                      strokeWidth={1}
                      strokeDasharray="3 4"
                    />
                    <text
                      x={left + 14}
                      y={node.y - 1}
                      fill="var(--color-muted)"
                      fontSize={13}
                      fontWeight={500}
                      fontFamily="var(--font-sans)"
                    >
                      {node.name}
                    </text>
                    {node.sub && (
                      <text
                        x={left + 14}
                        y={node.y + 13}
                        fill="var(--color-faint)"
                        fontSize={10}
                        fontFamily="var(--font-mono)"
                        letterSpacing="0.06em"
                      >
                        {node.sub.toUpperCase()}
                      </text>
                    )}
                    {node.icon && (
                      <NodeBadge x={left - 8} y={top - 8} icon={node.icon} active={isActiveNode} />
                    )}
                  </>,
                )}
              </g>
            )
          }

          if (node.kind === 'store') {
            return (
              <g
                key={node.id}
                className={nodeClass}
                style={nodeStyle}
                onMouseEnter={() => setNodeActive(node.id)}
                onMouseLeave={() => setNodeActive(null)}
              >
                {wrap(
                  <>
                    <rect
                      x={left}
                      y={top}
                      width={w}
                      height={h}
                      rx={2}
                      fill="var(--color-panel)"
                      stroke={isActiveNode ? 'var(--color-signal)' : 'var(--color-line)'}
                      strokeWidth={1}
                    />
                    {!node.icon && (
                      <rect
                        x={left + 6}
                        y={top + 6}
                        width={4}
                        height={4}
                        fill={isActiveNode ? 'var(--color-signal)' : 'var(--color-line)'}
                      />
                    )}
                    <line
                      x1={left}
                      y1={top + 9}
                      x2={left + w}
                      y2={top + 9}
                      stroke={isActiveNode ? 'var(--color-signal)' : 'var(--color-line)'}
                      strokeWidth={1}
                    />
                    <line
                      x1={left}
                      y1={top + h - 3}
                      x2={left + w}
                      y2={top + h - 3}
                      stroke={isActiveNode ? 'var(--color-signal)' : 'var(--color-line)'}
                      strokeWidth={1}
                    />
                    <text
                      x={left + 14}
                      y={node.y + 1}
                      fill="var(--color-ink)"
                      fontSize={13}
                      fontWeight={500}
                      fontFamily="var(--font-sans)"
                    >
                      {node.name}
                    </text>
                    {node.sub && (
                      <text
                        x={left + 14}
                        y={node.y + 15}
                        fill="var(--color-faint)"
                        fontSize={10}
                        fontFamily="var(--font-mono)"
                        letterSpacing="0.06em"
                      >
                        {node.sub.toUpperCase()}
                      </text>
                    )}
                    {node.icon && (
                      <NodeBadge x={left - 8} y={top - 8} icon={node.icon} active={isActiveNode} />
                    )}
                  </>,
                )}
              </g>
            )
          }

          return (
            <g
              key={node.id}
              className={nodeClass}
              style={nodeStyle}
              onMouseEnter={() => setNodeActive(node.id)}
              onMouseLeave={() => setNodeActive(null)}
            >
              {wrap(
                <>
                  <NodeFrame frame={spec.frame ?? 'square'} left={left} top={top} w={w} h={h} active={isActiveNode} index={index} />
                  {!node.icon && (
                    <rect
                      x={left + 6}
                      y={top + 6}
                      width={4}
                      height={4}
                      fill={isActiveNode ? 'var(--color-signal)' : 'var(--color-line)'}
                    />
                  )}
                  <text
                    x={left + 14}
                    y={node.y - 1}
                    fill="var(--color-ink)"
                    fontSize={13}
                    fontWeight={500}
                    fontFamily="var(--font-sans)"
                  >
                    {node.name}
                  </text>
                  {node.sub && (
                    <text
                      x={left + 14}
                      y={node.y + 13}
                      fill="var(--color-faint)"
                      fontSize={10}
                      fontFamily="var(--font-mono)"
                      letterSpacing="0.06em"
                    >
                      {node.sub.toUpperCase()}
                    </text>
                  )}
                  {node.icon && (
                    <NodeBadge x={left - 8} y={top - 8} icon={node.icon} active={isActiveNode} />
                  )}
                </>,
              )}
            </g>
          )
        })}

        {paths.map(({ edge, mid, chord }) => {
          if (!edge.label) return null
          if (chord < edge.label.length * LABEL_CHAR_W + LABEL_PAD) return null
          const dimmedEdge = isEdgeDimmed(edge)
          return (
            <text
              key={`label-${edge.from}-${edge.to}`}
              x={mid.x}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="edge-label"
              style={{
                opacity: dimmedEdge ? DIM_OPACITY : reduced || seen ? 1 : 0,
                transition: highlight ? 'opacity 120ms ease-out' : 'opacity 520ms ease-out',
              }}
            >
              {edge.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
