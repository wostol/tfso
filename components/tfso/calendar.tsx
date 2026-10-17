import { ArrowRight, MapPin } from 'lucide-react'
import { events, formatDateRu, type RegistrationStatus } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const statusStyles: Record<RegistrationStatus, { label: string; className: string }> = {
  open: { label: 'Регистрация открыта', className: 'bg-forest-soft text-forest-deep' },
  soon: { label: 'Скоро', className: 'bg-open/90 text-ink' },
  closed: { label: 'Закрыта', className: 'bg-ink/10 text-muted-foreground' },
  finished: { label: 'Завершён', className: 'bg-ink/10 text-muted-foreground' },
}

export function Calendar() {
  const sorted = [...events].sort((a, b) => +new Date(a.start) - +new Date(b.start))

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
              <a
                href="#"
                className="inline-flex items-center gap-1.5 font-semibold text-open underline-offset-4 hover:underline"
              >
                Весь календарь сезона <ArrowRight className="size-4" />
              </a>
            }
          />
        </Reveal>

        <ol className="mt-10 flex flex-col gap-3">
          {sorted.map((e, i) => {
            const status = statusStyles[e.status]
            const past = e.status === 'finished'
            return (
              <li key={e.id}>
                <Reveal delay={i * 60}>
                  <article
                    className={cn(
                      'group relative grid grid-cols-[5.5rem_1fr] overflow-hidden rounded-lg bg-paper text-ink transition duration-300 sm:grid-cols-[7.5rem_1fr_auto] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] focus-within:ring-3 focus-within:ring-open',
                      past && 'opacity-75 hover:opacity-100',
                    )}
                  >
                    <div className="relative flex flex-col items-center justify-center border-r-2 border-dashed border-ink/15 bg-card px-2 py-5 text-center">
                      <span className="font-mono text-3xl font-semibold leading-none tabular-nums sm:text-4xl">
                        {formatDateRu(e.start, { day: '2-digit' })}
                      </span>
                      <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {formatDateRu(e.start, { month: 'short' }).replace('.', '')}
                      </span>
                      <span className="mt-2 font-mono text-[11px] uppercase text-course">
                        {formatDateRu(e.start, { weekday: 'short' })}
                      </span>
                      <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-forest-deep" />
                      <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 size-5 rounded-full bg-forest-deep" />
                    </div>

                    <div className="flex min-w-0 flex-col justify-center gap-2 px-4 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-sm border border-ink/15 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider">
                          {e.discipline}
                        </span>
                        <span className={cn('rounded-sm px-1.5 py-0.5 text-[11px] font-semibold', status.className)}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug tracking-tight sm:text-xl">{e.title}</h3>
                      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-mono tabular-nums text-ink">
                          Старт {formatDateRu(e.start, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {e.place}
                        </span>
                        <span>{e.statusNote}</span>
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center border-t border-ink/10 px-4 py-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:px-6">
                      <a
                        href={e.action.href}
                        className={cn(
                          'inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition sm:w-auto',
                          e.status === 'open'
                            ? 'bg-course text-white hover:bg-course/90'
                            : 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
                        )}
                      >
                        {e.action.label}
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
