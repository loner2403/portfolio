import type { FrameId } from '@/components/diagram/frame-ids'

export function NodeFrame({
  frame,
  left,
  top,
  w,
  h,
  active,
  index,
}: {
  frame: FrameId
  left: number
  top: number
  w: number
  h: number
  active: boolean
  index: number
}) {
  const stroke = active ? 'var(--color-signal)' : 'var(--color-line)'
  const fill = 'var(--color-panel)'

  if (frame === 'dogear') {
    return (
      <>
        <path
          d={`M${left} ${top} H${left + w - 9} L${left + w} ${top + 9} V${top + h} H${left} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
        <path d={`M${left + w - 9} ${top} V${top + 9} H${left + w} Z`} fill="var(--color-line)" stroke={stroke} strokeWidth={1} />
      </>
    )
  }

  if (frame === 'stacked') {
    return (
      <>
        <rect
          x={left + 4}
          y={top + 4}
          width={w}
          height={h}
          rx={2}
          fill="none"
          stroke="var(--color-line)"
          opacity={0.6}
        />
        <rect x={left} y={top} width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
      </>
    )
  }

  if (frame === 'pill') {
    return <rect x={left} y={top} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={1} />
  }

  if (frame === 'barred') {
    return (
      <>
        <rect x={left} y={top} width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={left + 10} y={top + h - 4} width={w - 20} height={2} fill="var(--color-line)" />
        <rect
          className="frame-bar"
          x={left + 10}
          y={top + h - 4}
          width={w - 20}
          height={2}
          fill="var(--color-signal)"
          style={{ animationDuration: `${1.8 + (index % 3) * 0.9}s`, animationDelay: `${(index % 4) * 0.35}s` }}
        />
      </>
    )
  }

  return <rect x={left} y={top} width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
}
