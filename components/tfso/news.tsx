import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { news, formatDateRu } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const tagStyles: Record<string, string> = {
  Соревнования: 'bg-course text-white',
  Карты: 'bg-open text-ink',
  Сборная: 'bg-forest text-paper',
  Федерация: 'bg-ink text-paper',
}

export function News() {
  const [lead, ...rest] = news

  return (
    <section aria-labelledby="news-title" id="news" className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            id="news-title"
            index="02"
            eyebrow="Лента федерации"
            title="Новости"
            action={
              <a
                href="#"
                className="inline-flex items-center gap-1.5 font-semibold text-course underline-offset-4 hover:underline"
              >
                Все новости <ArrowRight className="size-4" />
              </a>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[7fr_5fr] lg:gap-8">
          <Reveal>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={lead.image || '/placeholder.svg'}
                  alt={lead.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover saturate-[0.8] transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-sm px-2 py-0.5 text-xs font-semibold', tagStyles[lead.tag])}>
                    {lead.tag}
                  </span>
                  <time dateTime={lead.date} className="font-mono text-xs tabular-nums text-muted-foreground">
                    {formatDateRu(lead.date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </time>
                </div>
                <h3 className="text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
                  <a href="#" className="after:absolute after:inset-0">
                    {lead.title}
                  </a>
                </h3>
                <p className="max-w-xl leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              </div>
            </article>
          </Reveal>

          <ul className="flex flex-col gap-4">
            {rest.map((item, i) => (
              <li key={item.id}>
                <Reveal delay={i * 80}>
                  <article className="group relative grid grid-cols-[7.5rem_1fr] gap-4 rounded-lg border border-border bg-card p-3 transition hover:border-forest/40 sm:grid-cols-[9rem_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.alt}
                        fill
                        sizes="144px"
                        className={cn(
                          'object-cover saturate-[0.8] transition duration-700 group-hover:scale-105',
                          item.isMap && 'scale-[2.2] object-[60%_40%] group-hover:scale-[2.3]',
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2 py-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn('rounded-sm px-1.5 py-0.5 text-[11px] font-semibold', tagStyles[item.tag])}
                        >
                          {item.tag}
                        </span>
                        <time dateTime={item.date} className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          {formatDateRu(item.date, { day: '2-digit', month: '2-digit' })}
                        </time>
                      </div>
                      <h3 className="font-heading text-[17px] font-semibold leading-snug tracking-tight text-ink">
                        <a href="#" className="after:absolute after:inset-0">
                          {item.title}
                        </a>
                      </h3>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
