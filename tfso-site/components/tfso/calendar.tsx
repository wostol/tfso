import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { formatDateRu } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { EventStatusBadge } from './event-status-badge'
import { getEvents, type ApiEvent } from '@/lib/events-api'

/**
 * Календарь соревнований на главной странице.
 *
 * Это SERVER COMPONENT — данные приходят с сервера (Next.js fetch к микросервису),
 * а не из браузера. Поэтому:
 *  - нет CORS (сервер-серверный вызов внутри Docker-сети);
 *  - нет «мигания» загрузкой на клиенте — пользователь сразу видит готовую разметку;
 *  - поисковики видят реальный контент (хорошо для SEO).
 *
 * Микросервис возвращает события, отсортированные по убыванию даты (как в ТЗ).
 * Здесь мы переворачиваем, чтобы ближайшие были сверху.
 */
export async function Calendar() {
  let events: ApiEvent[] = []
  let fetchError: string | null = null

  try {
    const { data } = await getEvents({ limit: 20 })
    events = [...data].sort(
      (a, b) => +new Date(a.eventDate) - +new Date(b.eventDate),
    )
  } catch (e) {
    // Микросервис недоступен — показываем аккуратное сообщение, страница не падает.
    fetchError = e instanceof Error ? e.message : 'Не удалось получить данные'
  }

  return (
    <section
      id="calendar"
      aria-labelledby="calendar-title"
      className="contour-texture-light relative bg-forest-deep py-16 text-paper md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            id="calendar-title"
            index="03"
            eyebrow="Ближайшие старты"
            title="Календарь соревнований"
            tone="dark"
            action={
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 font-semibold text-open underline-offset-4 hover:underline"
              >
                Весь календарь сезона <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        {fetchError ? (
          <div
            role="alert"
            className="mt-10 rounded-lg border border-open/40 bg-amber/15 p-5 text-sm text-paper"
          >
            <p className="font-semibold">Микросервис временно недоступен</p>
            <p className="mt-1 text-paper/70">
              Не удалось получить список мероприятий. Проверьте, что контейнер{' '}
              <code className="font-mono">tfso-events-api</code> запущен{' '}
              (<code className="font-mono">docker compose ps</code>).
            </p>
            <p className="mt-2 font-mono text-xs text-paper/50">{fetchError}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="mt-10 rounded-lg border border-paper/15 bg-paper/5 p-8 text-center text-paper/70">
            Пока нет запланированных мероприятий. Загляните позже — календарь
            обновляется автоматически из данных микросервиса.
          </div>
        ) : (
          <ol className="mt-10 flex flex-col gap-3">
            {events.map((e, i) => {
              const past = e.status === 'finished' || e.status === 'cancelled'
              return (
                <li key={e.id}>
                  <Reveal delay={i * 60}>
                    <Link
                      href={`/events/${e.id}`}
                      className={cn(
                        'group relative grid grid-cols-[5.5rem_1fr] overflow-hidden rounded-lg bg-paper text-ink transition duration-300 sm:grid-cols-[7.5rem_1fr_auto] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] focus-visible:ring-3 focus-visible:ring-open',
                        past && 'opacity-75 hover:opacity-100',
                      )}
                    >
                      <div className="relative flex flex-col items-center justify-center border-r-2 border-dashed border-ink/15 bg-card px-2 py-5 text-center">
                        <span className="font-mono text-3xl font-semibold leading-none tabular-nums sm:text-4xl">
                          {formatDateRu(e.eventDate, { day: '2-digit' })}
                        </span>
                        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {formatDateRu(e.eventDate, { month: 'short' }).replace('.', '')}
                        </span>
                        <span className="mt-2 font-mono text-[11px] uppercase text-course">
                          {formatDateRu(e.eventDate, { weekday: 'short' })}
                        </span>
                        <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-forest-deep" />
                        <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full bg-forest-deep" />
                      </div>

                      <div className="flex min-w-0 flex-col justify-center gap-2 px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-sm border border-ink/15 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider">
                            {e.discipline ?? '—'}
                          </span>
                          <EventStatusBadge status={e.status} />
                        </div>
                        <h3 className="text-lg font-bold leading-snug tracking-tight sm:text-xl">
                          {e.title}
                        </h3>
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {e.location}
                          </span>
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center border-t border-ink/10 px-4 py-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-6">
                        <span
                          className={cn(
                            'inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition sm:w-auto',
                            e.status === 'upcoming' || e.status === 'ongoing'
                              ? 'bg-course text-white group-hover:bg-course/90'
                              : 'border border-ink/20 text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-paper',
                          )}
                        >
                          {e.status === 'finished' ? 'Протокол' : e.status === 'cancelled' ? 'Отменено' : 'Подробнее'}
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
