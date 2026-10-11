import type { GraphSpec } from '@/components/diagram/types'

export const HERO_WALK_WIDE = [0, 2]
export const HERO_WALK_COMPACT = [0, 1]
export const HERO_WALK_LABEL = 'req_8f3a · ingest > store > extraction'

export const HERO_WIDE: GraphSpec = {
  viewBox: '0 0 900 400',
  groups: [
    { id: 'ingest', x: 10, y: 20, w: 190, h: 360, label: 'INGEST', tone: 'lane' },
    { id: 'data', x: 240, y: 20, w: 190, h: 360, label: 'DATA', tone: 'lane' },
    { id: 'reason', x: 470, y: 20, w: 190, h: 360, label: 'REASON', tone: 'lane' },
    { id: 'serve', x: 700, y: 20, w: 190, h: 360, label: 'SERVE', tone: 'lane' },
  ],
  nodes: [
    { id: 's03', x: 105, y: 110, w: 150, h: 44, kind: 'stage', name: 'ingest jobs', sub: 'S-03', href: '#system-S-03' },
    { id: 's05', x: 105, y: 290, w: 150, h: 44, kind: 'stage', name: 'batch jobs', sub: 'S-05', href: '#system-S-05' },
    { id: 'pg', x: 335, y: 120, w: 150, h: 44, kind: 'store', name: 'Relational DB', sub: 'store' },
    { id: 'qd', x: 335, y: 300, w: 150, h: 44, kind: 'store', name: 'Vector store', sub: 'retrieval' },
    { id: 's02', x: 565, y: 80, w: 150, h: 44, kind: 'stage', name: 'extraction', sub: 'S-02', href: '#system-S-02' },
    { id: 's01', x: 565, y: 200, w: 150, h: 44, kind: 'stage', name: 'agent workflows', sub: 'S-01', href: '#system-S-01' },
    { id: 's04', x: 565, y: 320, w: 150, h: 44, kind: 'stage', name: 'assistant', sub: 'S-04', href: '#system-S-04' },
    { id: 'cl', x: 795, y: 320, w: 150, h: 44, kind: 'ext', name: 'Client app', sub: 'SSE' },
  ],
  edges: [
    { from: 's03', to: 'pg', fromSide: 'right', toSide: 'left', label: 'ingest' },
    { from: 's05', to: 'pg', fromSide: 'right', toSide: 'left', label: 'store' },
    { from: 'pg', to: 's02', fromSide: 'right', toSide: 'left', label: 'retrieve' },
    { from: 's01', to: 'pg', fromSide: 'left', toSide: 'right', label: 'persist' },
    { from: 'qd', to: 's01', fromSide: 'right', toSide: 'left', label: 'retrieve' },
    { from: 'qd', to: 's04', fromSide: 'right', toSide: 'left', label: 'rag' },
    { from: 's04', to: 'cl', fromSide: 'right', toSide: 'left', label: 'stream' },
  ],
}

export const HERO_COMPACT: GraphSpec = {
  viewBox: '0 0 360 480',
  nodes: [
    { id: 's03', x: 110, y: 40, w: 140, h: 44, kind: 'stage', name: 'ingest jobs', sub: 'S-03', href: '#system-S-03' },
    { id: 'pg', x: 250, y: 150, w: 140, h: 44, kind: 'store', name: 'Relational DB', sub: 'store' },
    { id: 's01', x: 110, y: 260, w: 140, h: 44, kind: 'stage', name: 'agent workflows', sub: 'S-01', href: '#system-S-01' },
    { id: 's04', x: 250, y: 370, w: 140, h: 44, kind: 'stage', name: 'assistant', sub: 'S-04', href: '#system-S-04' },
    { id: 'cl', x: 110, y: 440, w: 140, h: 44, kind: 'ext', name: 'Client app', sub: 'SSE' },
  ],
  edges: [
    { from: 's03', to: 'pg', fromSide: 'bottom', toSide: 'top' },
    { from: 'pg', to: 's01', fromSide: 'bottom', toSide: 'top' },
    { from: 's01', to: 's04', fromSide: 'bottom', toSide: 'top' },
    { from: 's04', to: 'cl', fromSide: 'bottom', toSide: 'top' },
  ],
}
