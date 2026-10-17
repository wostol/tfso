import { ArrowUpRight, CalendarDays, FileSpreadsheet, Map, Users } from 'lucide-react'
import { Reveal } from './reveal'

const links = [
  {
    title: 'Календарь',
    text: '34 старта в сезоне, от парковых туров до чемпионата области',
    href: '#calendar',
    icon: CalendarDays,
    code: '31',
  },
  {
    title: 'Результаты и протоколы',
    text: 'Итоги, сплиты и рейтинг — в день старта',
    href: '#results',
    icon: FileSpreadsheet,
    code: '32',
  },
  {
    title: 'Карты и районы',
    text: '27 районов: лес, парк, спринт — с границами и запретами',
    href: '#news',
    icon: Map,
    code: '33',
  },
  {
    title: 'Вступить в федерацию',
    text: 'Членство, страховка, допуск и разряды',
    href: '#beginners',
    icon: Users,
    code: '34',
  },
]

export function QuickLinks() {
  return (
    <section aria-label="Быстрые ссылки" className="contour-texture py-14 md:py-20">
      <Reveal className="mx-auto max-w-7xl">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:grid md:grid-cols-2 md:overflow-visible md:px-8 lg:grid-cols-4">
          {links.map(({ title, text, href, icon: Icon, code }) => (
            <li key={title} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto">
              <a
                href={href}
                className="group relative flex h-full flex-col gap-10 rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-md bg-forest-soft text-forest transition group-hover:bg-forest group-hover:text-paper">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">КП {code}</span>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-ink">
                    {title}
                    <ArrowUpRight className="size-4 text-course opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">{text}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
