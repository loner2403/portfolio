import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GENERAL_INFO, NAV_SECTIONS } from '@/lib/data'
import { cn } from '@/lib/utils'
import Container from './Container'

function HeaderLink({
  id,
  label,
  isHome,
  onNavigate,
  marker,
}: {
  id: string
  label: string
  isHome: boolean
  onNavigate?: () => void
  marker?: boolean
}) {
  const className = cn(
    'font-mono text-[13px] text-muted transition-colors hover:text-ink',
    marker &&
      "data-[active]:text-ink data-[active]:before:mr-2 data-[active]:before:inline-block data-[active]:before:size-1 data-[active]:before:bg-signal data-[active]:before:content-['']",
  )
  if (isHome) {
    return (
      <a href={`#${id}`} onClick={onNavigate} className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link to={`/#${id}`} onClick={onNavigate} className={className}>
      {label}
    </Link>
  )
}

export default function SiteHeader() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    setIsMac(/Mac/.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  return (
    <header
      data-testid="site-header"
      className={cn(
        'sticky top-0 z-50 border-b transition-colors',
        scrolled ? 'border-line bg-bg/80 backdrop-blur-sm' : 'border-transparent bg-bg',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="Harshal Lade, home"
            className="flex items-center gap-2 font-mono text-sm text-ink"
          >
            <span>harshal.lade</span>
            {GENERAL_INFO.available && (
              <>
                <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
                <span className="hidden font-mono text-xs uppercase tracking-[0.08em] text-signal sm:inline">
                  available
                </span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_SECTIONS.map((section) => (
              <HeaderLink
                key={section.id}
                id={section.id}
                label={section.label}
                isHome={isHome}
                marker
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="cmdk-trigger"
              onClick={openPalette}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center whitespace-nowrap rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-ink"
            >
              {isMac ? '⌘K' : 'Ctrl K'}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-ink md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <Container>
            <nav className="flex flex-col py-4">
              {NAV_SECTIONS.map((section) => (
                <HeaderLink
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  isHome={isHome}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </nav>
          </Container>
        </div>
      )}

      <div
        className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-signal"
        aria-hidden="true"
      />
    </header>
  )
}
