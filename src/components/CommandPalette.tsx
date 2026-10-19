import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { GENERAL_INFO, NAV_SECTIONS, PROJECTS, SOCIAL_LINKS, SYSTEMS } from '@/lib/data'
import { scrollToTarget } from '@/motion/bus'

const itemClass =
  'group relative flex cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted transition-colors data-[selected=true]:before:opacity-100 data-[selected=true]:bg-panel-2 data-[selected=true]:text-ink before:absolute before:bottom-1 before:left-0 before:top-1 before:w-[2px] before:rounded-sm before:bg-signal before:opacity-0'

const headingClass = 'block px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-faint'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  const close = () => setOpen(false)

  const goToSection = (id: string) => {
    close()
    if (pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    const target = document.getElementById(id)
    if (target) scrollToTarget(target)
    window.history.replaceState(null, '', `#${id}`)
  }

  const goToProject = (slug: string) => {
    close()
    navigate(`/projects/${slug}`)
  }

  const openSystem = (slug: string) => {
    close()
    navigate(`/systems/${slug}`)
  }

  const copyEmail = () => {
    close()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GENERAL_INFO.email).catch(() => {})
    }
  }

  const openExternal = (url?: string) => {
    close()
    if (url) window.open(url, '_blank', 'noopener')
  }

  const github = SOCIAL_LINKS.find((link) => link.name === 'github')?.url
  const linkedin = SOCIAL_LINKS.find((link) => link.name === 'linkedin')?.url

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      data-testid="command-palette"
      overlayClassName="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[15vh] z-50 w-[min(640px,calc(100vw-32px))] -translate-x-1/2"
      className="overflow-hidden rounded-sm border border-line bg-panel font-mono text-ink"
    >
      <Command.Input
        placeholder="Type a command or search…"
        className="w-full border-b border-line bg-transparent px-4 py-3.5 text-sm text-ink outline-none placeholder:text-faint focus-visible:border-signal"
      />
      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-4 py-6 text-center text-sm text-muted">
          No results.
        </Command.Empty>

        <Command.Group heading={<span className={headingClass}>Navigate</span>}>
          {NAV_SECTIONS.map((section) => (
            <Command.Item
              key={section.id}
              value={`Go to ${section.label}`}
              onSelect={() => goToSection(section.id)}
              className={itemClass}
            >
              <span>Go to {section.label}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={<span className={headingClass}>Systems</span>}>
          {SYSTEMS.map((system) => (
            <Command.Item
              key={system.id}
              value={`System ${system.id} ${system.title}`}
              onSelect={() => openSystem(system.slug)}
              className={itemClass}
            >
              <span>{system.title}</span>
              <span className="ml-auto text-xs text-faint">{system.id}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={<span className={headingClass}>Projects</span>}>
          {PROJECTS.map((project) => (
            <Command.Item
              key={project.slug}
              value={`${project.title} ${project.slug} ${project.techStack.join(' ')}`}
              onSelect={() => goToProject(project.slug)}
              className={itemClass}
            >
              <span>{project.title}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={<span className={headingClass}>Actions</span>}>
          <Command.Item value="Copy email" onSelect={copyEmail} className={itemClass}>
            <span>Copy email</span>
          </Command.Item>
          <Command.Item value="GitHub" onSelect={() => openExternal(github)} className={itemClass}>
            <span>GitHub</span>
          </Command.Item>
          <Command.Item
            value="LinkedIn"
            onSelect={() => openExternal(linkedin)}
            className={itemClass}
          >
            <span>LinkedIn</span>
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="border-t border-line px-4 py-2 text-center text-[11px] text-faint">
        ↑↓ navigate · ↵ select · esc close
      </div>
    </Command.Dialog>
  )
}
