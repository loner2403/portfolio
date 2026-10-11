import {
  Archive,
  ArrowDownToLine,
  Bell,
  Braces,
  CalendarClock,
  ChartColumn,
  Clock,
  Combine,
  Compass,
  Database,
  FileDown,
  FileText,
  Flag,
  Layers,
  Link2,
  ListChecks,
  MessageSquare,
  NotebookText,
  Package,
  Radio,
  Reply,
  Save,
  Scale,
  ScanSearch,
  ScrollText,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Timer,
  Upload,
  Waves,
  Webhook,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { NodeIconId } from './icon-ids'

export const NODE_ICONS: Record<NodeIconId, LucideIcon> = {
  database: Database,
  vector: Layers,
  llm: Sparkles,
  prompts: ScrollText,
  plan: ListChecks,
  search: Search,
  analyse: ScanSearch,
  synthesise: Combine,
  validate: ShieldCheck,
  persist: Save,
  document: FileDown,
  parse: FileText,
  discover: Compass,
  extract: Braces,
  cache: Zap,
  'feed-live': Radio,
  'feed-batch': Package,
  'feed-event': Bell,
  clock: Clock,
  ingest: ArrowDownToLine,
  transform: Shuffle,
  checkpoint: Flag,
  load: Upload,
  client: MessageSquare,
  resolve: Link2,
  answer: Reply,
  stream: Waves,
  calendar: CalendarClock,
  webhook: Webhook,
  compare: Scale,
  chart: ChartColumn,
  storage: Archive,
  summarise: NotebookText,
  schedule: Timer,
}

export function NodeBadge({
  x,
  y,
  icon,
  active,
}: {
  x: number
  y: number
  icon: NodeIconId
  active: boolean
}) {
  const Icon = NODE_ICONS[icon]
  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden="true">
      <rect
        width={20}
        height={20}
        rx={3}
        fill="var(--color-bg)"
        stroke={active ? 'var(--color-signal)' : 'var(--color-faint)'}
        strokeWidth={1}
      />
      <Icon
        x={3.5}
        y={3.5}
        size={13}
        strokeWidth={1.6}
        color={active ? 'var(--color-signal)' : 'var(--color-ink)'}
      />
    </g>
  )
}
