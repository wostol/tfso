import { cn } from '@/lib/utils'

type SymbolProps = { className?: string }

export function StartSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-6', className)}>
      <path d="M20 6 L34 31 L6 31 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

export function ControlSymbol({ className, label }: SymbolProps & { label?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-6', className)}>
      <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
      {label ? (
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="currentColor"
          fontFamily="var(--font-mono-face)"
        >
          {label}
        </text>
      ) : null}
    </svg>
  )
}

export function FinishSymbol({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-6', className)}>
      <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
