import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/tfso/site-header'
import { SiteFooter } from '@/components/tfso/site-footer'
import { EventCard } from '@/components/tfso/event-card'
import { EventFilters } from '@/components/tfso/event-filters'
import { getEvents, type EventStatus } from '@/lib/events-api'

type SearchParams = {
  status?: string
  search?: string
  limit?: string
  offset?: string
}

const VALID_STATUSES: EventStatus[] = ['upcoming', 'ongoing', 'finished', 'cancelled']

/**
 * Страница календаря /events.
 *
 * Это SERVER COMPONENT — читает searchParams из URL и делает запрос
 * к микросервису с этими параметрами. При изменении фильтра (client)
 * URL обновляется, и Next.js заново вызывает этот компонент.
 */
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const status: EventStatus | undefined = VALID_STATUSES.includes(sp.status as EventStatus)
    ? (sp.status as EventStatus)
    : undefined
  const search = sp.search?.trim() || undefined
  const limit = Math.min(100, Math.max(1, Number(sp.limit) || 20))
  const offset = Math.max(0, Number(sp.offset) || 0)

  let data: Awaited<ReturnType<typeof getEvents>> | null = null
  let error: string | null = null

  try {
    data = await getEvents({ status, search, limit, offset })
  } catch (e) {
    error = e instanceof Error ? e.message : 'Микросервис недоступен'
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="contour-texture-light min-h-screen bg-paper pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            На главную
          </Link>

          <header className="mt-6 flex flex-col gap-3">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-course text-[11px] font-bold text-course">
                03
              </span>
              Календарь соревнований
            </p>
            <h1 className="text-4xl font-bold tracking-[-0.03em] md:text-5xl">
              Все мероприятия сезона
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Календарь обновляется автоматически из данных микросервиса
              <code className="mx-1 font-mono text-sm text-ink">tfso-events-api</code>
              — каждое изменение в БД отражается на сайте без правки кода.
            </p>
          </header>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <EventFilters />
          </div>

          <div className="mt-8">
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 p-6"
              >
                <p className="font-semibold text-destructive">Микросервис временно недоступен</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Проверьте, что контейнер <code className="font-mono">tfso-events-api</code>{' '}
                  запущен (<code className="font-mono">docker compose ps</code>).
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground/70">{error}</p>
              </div>
            ) : data && data.data.length > 0 ? (
              <>
                <p className="mb-4 font-mono text-sm text-muted-foreground">
                  Найдено: <span className="font-semibold text-ink">{data.meta.total}</span>
                  {data.meta.total > 1 ? ' мероприятий' : ' мероприятие'}
                  {(search || status) && ' по фильтрам'}
                </p>
                <ol className="flex flex-col gap-3">
                  {data.data.map((e) => (
                    <li key={e.id}>
                      <EventCard event={e} />
                    </li>
                  ))}
                </ol>

                {/* Простая пагинация через searchParams */}
                {data.meta.total > limit && (
                  <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Пагинация">
                    {offset > 0 && (
                      <Link
                        href={`/events?${new URLSearchParams({
                          ...(status ? { status } : {}),
                          ...(search ? { search } : {}),
                          limit: String(limit),
                          offset: String(Math.max(0, offset - limit)),
                        }).toString()}`}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-ink/15 px-4 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        <ArrowLeft className="size-4" />
                        Назад
                      </Link>
                    )}
                    <span className="font-mono text-sm text-muted-foreground">
                      {offset + 1}–{Math.min(offset + limit, data.meta.total)} из {data.meta.total}
                    </span>
                    {offset + limit < data.meta.total && (
                      <Link
                        href={`/events?${new URLSearchParams({
                          ...(status ? { status } : {}),
                          ...(search ? { search } : {}),
                          limit: String(limit),
                          offset: String(offset + limit),
                        }).toString()}`}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-ink/15 px-4 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        Вперёд
                        <ArrowLeft className="size-4 rotate-180" />
                      </Link>
                    )}
                  </nav>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-border bg-card p-10 text-center">
                <p className="text-lg font-semibold text-ink">Ничего не найдено</p>
                <p className="mt-2 text-muted-foreground">
                  Попробуйте изменить параметры фильтра или сбросить их.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-flex h-10 items-center rounded-md border border-ink/15 px-4 text-sm font-semibold transition hover:bg-ink hover:text-paper"
                >
                  Сбросить фильтры
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
