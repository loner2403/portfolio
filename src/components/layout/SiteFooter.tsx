import Container from './Container'
import MotionToggle from './MotionToggle'
import StatusClock from './StatusClock'
import { COLOPHON, GENERAL_INFO } from '@/lib/data'

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-4 py-8 font-mono text-xs text-muted">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {GENERAL_INFO.available && (
              <span className="flex items-center gap-2">
                <span className="size-1 bg-signal" aria-hidden="true" />
                available for work
              </span>
            )}
            <span>{GENERAL_INFO.location}</span>
            <StatusClock />
            <MotionToggle />
          </div>
          <div className="border-t border-line pt-4 text-faint">
            <span>
              © 2026 Harshal Lade ·{' '}
              {COLOPHON.map((item) => `${item.label} ${item.value}`).join(' / ')}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
