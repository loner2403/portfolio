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
  tone = 'default',
}: {
  id: string
  index: string
  label: string
  title: string
  children: ReactNode
  className?: string
  last?: boolean
  tone?: 'default' | 'signal'
}) {
  const signal = tone === 'signal'
  return (
    <section
      id={id}
      className={cn(
        'relative py-24 md:py-32',
        signal ? 'tone-ink border-transparent bg-card-1' : 'border-t border-line',
        className,
      )}
    >
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
        {signal ? (
          <h2 className="mt-6 pb-[0.1em] font-display text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.01em] text-ink">
            {title}
          </h2>
        ) : (
          <h2
            data-split
            className="mt-6 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
          >
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  )
}
