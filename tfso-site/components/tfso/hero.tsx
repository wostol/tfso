import Image from 'next/image'
import { ArrowRight, Compass } from 'lucide-react'
import { HeroCourse } from './hero-course'
import { Countdown } from './countdown'
import { DeadlineBanner } from './deadline-banner'
import { getEvents, type ApiEvent } from '@/lib/events-api'

/**
 * Hero главной страницы. Это SERVER COMPONENT — мы запрашиваем ближайшее
 * мероприятие у микросервиса на сервере и передаём его в клиентский Countdown.
 */
export async function Hero() {
  let nextEvent: ApiEvent | null = null
  try {
    // Берём первые 20 мероприятий и ищем ближайшее будущее (upcoming/ongoing)
    const { data } = await getEvents({ limit: 20 })
    const today = Date.now()
    nextEvent =
      data
        .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
        .filter((e) => new Date(e.eventDate).getTime() + 86_400_000 >= today) // сегодня или позже
        .sort((a, b) => +new Date(a.eventDate) - +new Date(b.eventDate))[0] ?? null
  } catch {
    // Микросервис недоступен — countdown не покажем, остальное работает
  }

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border">
      <Image
        src="/images/hero-map.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover saturate-[0.85]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-paper/95 via-paper/80 to-paper/40 lg:bg-gradient-to-r lg:from-paper lg:via-paper/85 lg:to-paper/0"
      />

      <div className="pt-24 md:pt-28">
        <DeadlineBanner />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-10 pt-10 md:px-8 md:pb-16 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-4 lg:pt-12">
        <div className="flex flex-col gap-7">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-forest">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-2.5 py-1 font-semibold text-paper">
              Сезон 2026
            </span>
            <span>Осень · бесснежный период</span>
            <span className="text-muted-foreground">9 / 12 этапов</span>
          </p>

          <h1
            id="hero-title"
            className="text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            Точный маршрут через&nbsp;томский лес
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-ink/75">
            Сообщество спортсменов, тренеров, судей и организаторов. Календарь стартов, протоколы, карты районов и
            клубы — в&nbsp;одном месте.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#calendar"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-course px-6 font-semibold text-white shadow-sm transition hover:bg-course/90"
            >
              Календарь соревнований
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#beginners"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-ink/20 bg-card/70 px-6 font-semibold text-ink backdrop-blur-sm transition hover:border-ink/40 hover:bg-card"
            >
              <Compass className="size-4" />
              Для новичков
            </a>
          </div>

          <div className="max-w-sm">
            <Countdown nextEvent={nextEvent} />
          </div>
        </div>

        <div className="relative aspect-[720/520] w-full lg:-mr-8">
          <HeroCourse />
          <p className="absolute bottom-0 right-0 hidden rounded-sm bg-paper/85 px-2 py-1 font-mono text-[11px] tabular-nums text-ink/70 sm:block">
            М 1:10 000 · сечение 2,5 м · Ж21 — 4,8 км · 6 КП
          </p>
        </div>
      </div>
    </section>
  )
}
