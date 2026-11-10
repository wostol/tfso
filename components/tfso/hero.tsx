import { ArrowRight, Compass, MapPin } from 'lucide-react'
import { HeroCourse } from './hero-course'
import { Countdown } from './countdown'
import { DeadlineBanner } from './deadline-banner'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="contour-texture-light relative isolate overflow-hidden bg-forest-deep text-paper"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(90rem_50rem_at_85%_-10%,rgba(46,107,63,0.55),transparent_60%),radial-gradient(60rem_40rem_at_-10%_110%,rgba(168,36,124,0.18),transparent_55%)]"
      />

      <div className="pt-24 md:pt-28">
        <DeadlineBanner />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-10 md:px-8 md:pb-20 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-12 lg:pt-16">
        <div className="flex flex-col gap-8">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-paper/60">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-course px-2.5 py-1 font-semibold tracking-[0.12em] text-white">
              Сезон 2026
            </span>
            <span>Осень · бесснежный период</span>
            <span className="text-paper/40">9 / 12 этапов</span>
          </p>

          <h1
            id="hero-title"
            className="text-[2.9rem] font-extrabold leading-[0.96] tracking-[-0.035em] sm:text-7xl lg:text-[5.4rem]"
          >
            Точный маршрут через{' '}
            <span className="relative inline-block text-open">
              томский&nbsp;лес
              <svg
                aria-hidden="true"
                viewBox="0 0 320 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-course"
              >
                <path
                  d="M4 10 C 60 2, 140 12, 200 6 S 300 4, 316 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-paper/70">
            Сообщество спортсменов, тренеров, судей и организаторов. Календарь стартов, протоколы, карты районов и
            клубы — в&nbsp;одном месте.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#calendar"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-course px-6 font-semibold text-white shadow-lg shadow-course/25 transition hover:bg-course/85"
            >
              Календарь соревнований
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#beginners"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-paper/25 px-6 font-semibold text-paper transition hover:border-paper/50 hover:bg-paper/5"
            >
              <Compass className="size-4" />
              Для новичков
            </a>
          </div>

          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/10 pt-6">
            {[
              ['14', 'клубов области'],
              ['120+', 'стартов в год'],
              ['1987', 'год основания'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-3xl font-extrabold tabular-nums text-paper">{value}</dd>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-5">
          <figure className="overflow-hidden rounded-xl border border-paper/15 bg-paper shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-course" />
                Басандайка · классика
              </span>
              <span className="tabular-nums">М 1:10 000</span>
            </div>
            <div className="relative aspect-[720/520] w-full">
              <HeroCourse />
            </div>
            <figcaption className="border-t border-ink/10 px-4 py-2.5 font-mono text-[11px] tabular-nums text-ink/60">
              сечение 2,5 м · Ж21 — 4,8 км · 6 КП
            </figcaption>
          </figure>

          <Countdown />
        </div>
      </div>
    </section>
  )
}
