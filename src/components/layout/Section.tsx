import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Container from './Container'
import Rail from './Rail'

export default function Section({
  id,
  index,
  label,
  title,
  children,
  className,
  last,
}: {
  id: string
  index: string
  label: string
  title: string
  children: ReactNode
  className?: string
  last?: boolean
}) {
  return (
    <section id={id} className={cn('relative border-t border-line py-24 md:py-32', className)}>
      <Rail marker last={last} />
      <Container>
        <div data-reveal className="flex items-center gap-4">
          <span className="label">
            [{index}] {label}
          </span>
          <span className="relative h-px flex-1 bg-line" aria-hidden="true">
            <span data-hairline className="absolute inset-0 origin-left bg-faint" />
          </span>
        </div>
        <h2
          data-split
          className="mt-6 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
        >
          {title}
        </h2>
        {children}
      </Container>
    </section>
  )
}
