import Link from 'next/link'
import { ArrowLeft, MapPin, CalendarDays, Flag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/tfso/site-header'
import { SiteFooter } from '@/components/tfso/site-footer'
import { EventStatusBadge } from '@/components/tfso/event-status-badge'
import { ResultsTable } from '@/components/tfso/results-table'
import { getEvent, getResults, EventsApiError } from '@/lib/events-api'
import { formatDateRu } from '@/lib/data'

/**
 * Страница мероприятия /events/:id.
 *
 * SERVER COMPONENT — параллельно запрашивает и само мероприятие,
 * и его протокол результатов. Если 404 — рендерим встроенную страницу
 * not-found через notFound().
 */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let event
  try {
    event = await getEvent(id)
  } catch (e) {
    if (e instanceof EventsApiError && e.statusCode === 404) {
      notFound()
    }
    // Иные ошибки пробрасываем — их поймает error.tsx
    throw e
  }

  // Протокол результатов — параллельный запрос; если упал, не роняем страницу
  let results: Awaited<ReturnType<typeof getResults>> = { data: [], meta: { total: 0, finished: 0 } }
  try {
    results = await getResults(id)
  } catch {
    /* протокол недоступен — покажем пустое состояние */
  }

  const isFinished = event.status === 'finished'
  const isCancelled = event.status === 'cancelled'

  return (
    <>
      <SiteHeader />
      <main id="main" className="contour-texture-light min-h-screen bg-paper pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Все мероприятия
          </Link>

          <header className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm border border-ink/15 px-2 py-0.5 font-mono text-xs uppercase tracking-wider">
                {event.discipline ?? '—'}
              </span>
              <EventStatusBadge status={event.status} />
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">{event.title}</h1>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-course" />
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Дата</dt>
                  <dd className="font-semibold text-ink">
                    {formatDateRu(event.eventDate, { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' })}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-course" />
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Место проведения</dt>
                  <dd className="font-semibold text-ink">{event.location}</dd>
                </div>
              </div>
            </dl>

            {event.description && (
              <p className="max-w-3xl leading-relaxed text-muted-foreground">{event.description}</p>
            )}
          </header>

          {/* Действия */}
          <div className="mt-8 flex flex-wrap gap-3">
            {isCancelled ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
                Мероприятие отменено
              </div>
            ) : isFinished ? (
              <a
                href="#results"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-6 font-semibold text-paper transition hover:bg-ink/85"
              >
                Смотреть результаты
              </a>
            ) : (
              <a
                href="https://orgeo.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-course px-6 font-semibold text-white transition hover:bg-course/90"
              >
                Подать заявку на orgeo.ru
              </a>
            )}
          </div>

          {/* Результаты */}
          <section id="results" className="mt-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">Протокол результатов</h2>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {results.meta.total > 0
                    ? `${results.meta.total} участников · ${results.meta.finished} финишировало`
                    : 'Пока нет ни одного результата'}
                </p>
              </div>
              {results.meta.total > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest">
                  <Flag className="size-3.5" />
                  Live из микросервиса
                </span>
              )}
            </div>

            <div className="mt-4">
              <ResultsTable results={results.data} />
            </div>
          </section>

          {/* Как добраться — заглушка (в будущем здесь будет карта Leaflet) */}
          <section className="mt-12 rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-bold tracking-tight text-ink">Как добраться</h2>
            <p className="mt-2 text-muted-foreground">
              Точка старта: <strong className="text-ink">{event.location}</strong>.
              На следующем этапе здесь появится интерактивная карта с маршрутом
              до места соревнований (Leaflet + OpenStreetMap).
            </p>
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(event.location + ', Томск')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-ink/15 px-4 text-sm font-semibold transition hover:bg-ink hover:text-paper"
            >
              Открыть в Яндекс.Картах
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
