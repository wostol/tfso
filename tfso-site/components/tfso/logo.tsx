import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-3 rounded-md outline-offset-4', className)}
      aria-label="ТФСО — на главную"
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className={cn('shrink-0 transition-all duration-300', compact ? 'size-9' : 'size-11')}
      >
        <circle cx="24" cy="24" r="22" fill="var(--forest)" />
        <circle cx="24" cy="24" r="17" fill="none" stroke="var(--paper)" strokeOpacity="0.35" strokeWidth="1" />
        <path d="M24 3v4M24 41v4M3 24h4M41 24h4" stroke="var(--paper)" strokeWidth="2" strokeLinecap="round" />
        <g className="compass-needle">
          <path d="M24 9 L28.5 24 L19.5 24 Z" fill="var(--course)" />
          <path d="M24 39 L28.5 24 L19.5 24 Z" fill="var(--paper)" />
        </g>
        <circle cx="24" cy="24" r="2.2" fill="var(--forest-deep)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-extrabold tracking-tight text-ink">ТФСО</span>
        <span
          className={cn(
            'mt-1 max-w-[11rem] text-[11px] leading-tight text-muted-foreground transition-all duration-300',
            compact && 'hidden sm:block',
          )}
        >
          Томская федерация спортивного ориентирования
        </span>
      </span>
    </Link>
  )
}
