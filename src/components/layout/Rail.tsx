import { cn } from '@/lib/utils'

export default function Rail({ marker = false, last = false }: { marker?: boolean; last?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[1280px] -translate-x-1/2 lg:block"
    >
      <span
        className={cn(
          'absolute left-4 w-px bg-line',
          last ? 'top-0 h-[calc(6rem+10px)] md:h-[calc(8rem+10px)]' : 'inset-y-0',
        )}
      />
      {marker && (
        <span
          className={cn(
            'rail-marker absolute bg-bg',
            last
              ? 'left-[11px] top-[calc(6rem+4px)] h-[11px] w-[11px] border border-signal md:top-[calc(8rem+4px)]'
              : 'left-[13px] top-[calc(6rem+6px)] h-[7px] w-[7px] border border-faint md:top-[calc(8rem+6px)]',
          )}
        />
      )}
    </div>
  )
}
