import { ArrowRight, Download, FileText, Table2 } from 'lucide-react'
import { clubs, documents, protocols, formatDateRu } from '@/lib/data'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

function FileList({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: typeof FileText
  items: { title: string; date: string; meta: string }[]
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Icon className="size-5 text-forest" />
          {title}
        </h3>
        <a href="#" className="text-sm font-semibold text-course underline-offset-4 hover:underline">
          Архив
        </a>
      </div>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.title}>
            <a href="#" className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/60">
              <time
                dateTime={item.date}
                className="w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
              >
                {formatDateRu(item.date, { day: '2-digit', month: '2-digit' })}
              </time>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{item.title}</span>
                <span className="block font-mono text-[11px] text-muted-foreground">{item.meta}</span>
              </span>
              <Download className="size-4 shrink-0 text-muted-foreground transition group-hover:text-course" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Results() {
  return (
    <section id="results" aria-labelledby="results-title" className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading id="results-title" index="04" eyebrow="Протоколы, документы, клубы" title="Результаты и архив" />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <FileList title="Последние протоколы" icon={Table2} items={protocols} />
          </Reveal>
          <Reveal delay={80}>
            <FileList title="Документы федерации" icon={FileText} items={documents} />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Клубы области</h3>
              <p className="mt-1 text-muted-foreground">14 клубов · 412 спортсменов в рейтинге</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 font-semibold text-course underline-offset-4 hover:underline"
            >
              Все клубы <ArrowRight className="size-4" />
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {clubs.map((club) => (
              <li key={club.name}>
                <a
                  href="#"
                  className="group flex h-full flex-col items-start gap-4 rounded-lg border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-md"
                >
                  <span
                    className="flex size-12 items-center justify-center rounded-full font-heading text-sm font-bold text-white grayscale transition group-hover:grayscale-0"
                    style={{ backgroundColor: club.color }}
                    aria-hidden="true"
                  >
                    {club.short}
                  </span>
                  <span>
                    <span className="block font-semibold leading-tight text-ink">{club.name}</span>
                    <span className="mt-0.5 block font-mono text-xs tabular-nums text-muted-foreground">
                      {club.members} чел.
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
