import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
const CELL = 'flex min-h-12 flex-1 items-center justify-center font-mono text-xs text-ink'
export default function MobileDock() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) { setVisible(true); return }
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 })
    io.observe(hero)
    return () => io.disconnect()
  }, [pathname])
  useEffect(() => {
    document.documentElement.dataset.dock = visible ? 'on' : 'off'
  }, [visible])
  const base = pathname === '/' ? '' : '/'
  return (
    <nav
      data-testid="mobile-dock"
      data-visible={visible ? 'true' : 'false'}
      inert={!visible}
      aria-label="Quick links"
      className={`fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <a href={`${base}#systems`} className={CELL}>Systems</a>
      <a href={`${base}#work`} className={CELL}>Work</a>
      <button type="button" className={CELL} onClick={() => window.dispatchEvent(new CustomEvent('open-probe'))}>Ask</button>
      <a href={`${base}#contact`} className={CELL}>Contact</a>
    </nav>
  )
}
