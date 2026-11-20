'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { Search } from 'lucide-react'
import type { EventStatus } from '@/lib/events-api'

const statusOptions: { value: '' | EventStatus; label: string }[] = [
  { value: '', label: 'Все статусы' },
  { value: 'upcoming', label: 'Запланировано' },
  { value: 'ongoing', label: 'Идёт сейчас' },
  { value: 'finished', label: 'Завершено' },
  { value: 'cancelled', label: 'Отменено' },
]

/**
 * Фильтр для календаря мероприятий.
 *
 * Записывает значения в URL (?status=...&search=...) — поэтому состояние
 * фильтра шарится между перезагрузками и им можно поделиться ссылкой.
 * При изменении фильтра серверный компонент страницы заново делает запрос
 * к микросервису с новыми параметрами.
 */
export function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [status, setStatus] = useState(searchParams.get('status') ?? '')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  // Если пользователь пришёл по прямой ссылке с параметрами — синхронизируем форму
  useEffect(() => {
    setStatus(searchParams.get('status') ?? '')
    setSearch(searchParams.get('search') ?? '')
  }, [searchParams])

  function commit(nextStatus: string, nextSearch: string) {
    const params = new URLSearchParams()
    if (nextStatus) params.set('status', nextStatus)
    if (nextSearch) params.set('search', nextSearch)
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `/events?${qs}` : '/events')
    })
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        commit(status, search)
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Статус</span>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            commit(e.target.value, search)
          }}
          className="h-11 rounded-md border border-input bg-background px-3 text-base outline-none transition focus-visible:border-course focus-visible:ring-3 focus-visible:ring-course/20"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Поиск по названию или месту</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Например: Басандайка или спринт"
            className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-base outline-none transition focus-visible:border-course focus-visible:ring-3 focus-visible:ring-course/20"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="h-11 inline-flex items-center justify-center rounded-md bg-course px-6 font-semibold text-white transition hover:bg-course/90 disabled:opacity-60"
      >
        {isPending ? 'Поиск…' : 'Найти'}
      </button>
    </form>
  )
}
