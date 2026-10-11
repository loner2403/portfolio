import Container from './Container'
import MotionToggle from './MotionToggle'

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-2 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Harshal Lade</span>
          <span>Mumbai, IST (UTC+5:30)</span>
          <span>Built with React, Vite, Tailwind</span>
          <MotionToggle />
        </div>
      </Container>
    </footer>
  )
}
