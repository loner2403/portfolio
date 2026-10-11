import type { NodeIconId } from './icon-ids'
import type { FrameId } from './frame-ids'

export type Side = 'left' | 'right' | 'top' | 'bottom'

export interface GNode {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  kind: 'stage' | 'store' | 'ext' | 'tag'
  name: string
  sub?: string
  href?: string
  icon?: NodeIconId
}

export interface GEdge {
  from: string
  to: string
  fromSide: Side
  toSide: Side
  fromAt?: { x: number; y: number }
  toAt?: { x: number; y: number }
  curve?: [number, number, number, number]
  label?: string
  dashed?: boolean
  packet?: boolean
}

export interface GGroup {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  tone?: 'default' | 'lane'
}

export interface GraphSpec {
  viewBox: string
  frame?: FrameId
  groups?: GGroup[]
  nodes: GNode[]
  edges: GEdge[]
}
