import { cn } from '@/lib/utils'

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  action,
  tone = 'light',
}: {
  id: string
  index: string
  eyebrow: string
  title: string
  action?: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3">
        <p
          className={cn(
            'flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em]',
            tone === 'dark' ? 'text-forest-soft/70' : 'text-muted-foreground',
          )}
        >
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-full border-2 text-[11px] font-bold',
              tone === 'dark' ? 'border-open text-open' : 'border-course text-course',
            )}
          >
            {index}
          </span>
          {eyebrow}
        </p>
        <h2
          id={id}
          className={cn(
            'text-3xl font-bold tracking-[-0.03em] md:text-[2.75rem] md:leading-[1.05]',
            tone === 'dark' ? 'text-paper' : 'text-ink',
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
