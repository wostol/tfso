'use client'

import { useEffect, useState } from 'react'
import { formatDateRu } from '@/lib/data'
import type { ApiEvent } from '@/lib/events-api'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Клиентский компонент обратного отсчёта до ближайшего старта.
 * Сам event приходит как проп из серверного родителя (Hero) — клиентский
 * код не делает HTTP-запросов к микросервису, только рисует таймер.
 *
 * eventDate — дата YYYY-MM-DD. Для отсчёта мы принимаем старт в 10:00
 * (типичное время старта соревнований), если точное время не задано.
 */
export function Countdown({ nextEvent }: { nextEvent: ApiEvent | null }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!nextEvent) return null

  // Принимаем старт в 10:00 по томскому времени, если точное время не задано
  const startMs = new Date(`${nextEvent.eventDate}T10:00:00+07:00`).getTime()
  const diff = now === null ? 0 : Math.max(0, startMs - now)
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
      <p className="mt-1 font-heading text-[15px] font-semibold leading-snug text-ink">{nextEvent.title}</p>
      <p className="font-mono text-xs tabular-nums text-muted-foreground">
        {formatDateRu(nextEvent.eventDate, { day: '2-digit', month: '2-digit', weekday: 'short' })} · {nextEvent.location}
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
