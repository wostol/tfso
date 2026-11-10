'use client'

import { useEffect, useState } from 'react'
import { AlarmClock, X } from 'lucide-react'
import { deadline } from '@/lib/data'

const storageKey = `tfso-deadline-dismissed:${deadline.id}`

export function DeadlineBanner() {
  const [visible, setVisible] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(storageKey) !== '1')
    const check = () => setExpired(Date.now() >= new Date(deadline.due).getTime())
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <div role="region" aria-label="Важное объявление" className="relative z-30 mx-auto max-w-7xl px-5 md:px-8">
      <div className="flex flex-col gap-3 rounded-lg border border-amber/40 bg-amber/15 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:pr-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber text-white">
          <AlarmClock className="size-5" />
        </span>
        <p className="flex-1 text-[15px] leading-snug text-paper/90">
          {deadline.text}{' '}
          <strong className="font-mono font-semibold tabular-nums text-open">{deadline.dueLabel}</strong>
          {expired ? <span className="ml-1 text-paper/60">— приём завершён.</span> : null}
        </p>
        <div className="flex items-center gap-2">
          <a
            href={expired ? undefined : '#calendar'}
            aria-disabled={expired}
            className="inline-flex h-9 items-center rounded-md bg-paper px-4 text-sm font-semibold text-forest-deep transition hover:bg-paper/85 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          >
            {expired ? 'Срок истёк' : deadline.actionLabel}
          </a>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(storageKey, '1')
              setVisible(false)
            }}
            className="flex size-9 items-center justify-center rounded-md text-paper/70 transition hover:bg-paper/10 hover:text-paper"
          >
            <X className="size-4" />
            <span className="sr-only">Скрыть объявление</span>
          </button>
        </div>
      </div>
    </div>
  )
}
