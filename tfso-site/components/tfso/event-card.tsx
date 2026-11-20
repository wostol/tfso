import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { formatDateRu } from '@/lib/data'
import { cn } from '@/lib/utils'
import { EventStatusBadge } from '@/components/tfso/event-status-badge'
import type { ApiEvent } from '@/lib/events-api'

/** Карточка мероприятия в списке — переиспользуется на главной и на /events */
export function EventCard({ event }: { event: ApiEvent }) {
  const past = event.status === 'finished' || event.status === 'cancelled'
  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'group relative grid grid-cols-[5.5rem_1fr] overflow-hidden rounded-lg bg-paper text-ink transition duration-300 sm:grid-cols-[7.5rem_1fr_auto] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] focus-visible:ring-3 focus-visible:ring-open',
        past && 'opacity-75 hover:opacity-100',
      )}
    >
      <div className="relative flex flex-col items-center justify-center border-r-2 border-dashed border-ink/15 bg-card px-2 py-5 text-center">
        <span className="font-mono text-3xl font-semibold leading-none tabular-nums sm:text-4xl">
          {formatDateRu(event.eventDate, { day: '2-digit' })}
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {formatDateRu(event.eventDate, { month: 'short' }).replace('.', '')}
        </span>
        <span className="mt-2 font-mono text-[11px] uppercase text-course">
          {formatDateRu(event.eventDate, { weekday: 'short' })}
        </span>
        <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-forest-deep" />
        <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full bg-forest-deep" />
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-2 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-ink/15 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider">
            {event.discipline ?? '—'}
          </span>
          <EventStatusBadge status={event.status} />
        </div>
        <h3 className="text-lg font-bold leading-snug tracking-tight sm:text-xl">
          {event.title}
        </h3>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {event.location}
          </span>
        </p>
      </div>

      <div className="col-span-2 flex items-center border-t border-ink/10 px-4 py-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-6">
        <span
          className={cn(
            'inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition sm:w-auto',
            event.status === 'upcoming' || event.status === 'ongoing'
              ? 'bg-course text-white group-hover:bg-course/90'
              : 'border border-ink/20 text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-paper',
          )}
        >
          {event.status === 'finished' ? 'Протокол' : event.status === 'cancelled' ? 'Отменено' : 'Подробнее'}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
