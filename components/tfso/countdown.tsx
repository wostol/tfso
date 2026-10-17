'use client'

import { useEffect, useState } from 'react'
import { events, formatDateRu } from '@/lib/data'

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const next = events
    .filter((e) => now === null || new Date(e.start).getTime() > now)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))[0]

  if (!next) return null

  const diff = now === null ? 0 : Math.max(0, new Date(next.start).getTime() - now)
  const parts = [
    { value: Math.floor(diff / 86_400_000), label: 'дн' },
    { value: Math.floor(diff / 3_600_000) % 24, label: 'ч' },
    { value: Math.floor(diff / 60_000) % 60, label: 'мин' },
    { value: Math.floor(diff / 1000) % 60, label: 'сек' },
  ]

  return (
    <div className="rounded-lg border border-ink/10 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          До ближайшего старта
        </p>
        <span className="flex items-center gap-1.5 text-xs text-forest">
          <span className="size-1.5 rounded-full bg-forest motion-safe:animate-pulse" aria-hidden="true" />
          live
        </span>
      </div>
      <p className="mt-1 font-heading text-[15px] font-semibold leading-snug text-ink">{next.title}</p>
      <p className="font-mono text-xs tabular-nums text-muted-foreground">
        {formatDateRu(next.start, { day: '2-digit', month: '2-digit', weekday: 'short' })} ·{' '}
        {formatDateRu(next.start, { hour: '2-digit', minute: '2-digit' })} · {next.place}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1.5 font-mono tabular-nums" aria-live="off">
        {parts.map((p) => (
          <div key={p.label} className="rounded-md bg-ink px-2 py-2 text-center text-paper">
            <span className="block text-xl font-semibold leading-none md:text-2xl">
              {now === null ? '--' : pad(p.value)}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-wider text-paper/60">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
