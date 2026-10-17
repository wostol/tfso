import { ArrowRight } from 'lucide-react'
import { ControlSymbol, FinishSymbol, StartSymbol } from './map-symbols'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

const steps = [
  {
    symbol: <StartSymbol className="size-10" />,
    title: 'Выберите старт',
    text: 'Парковые туры и группа «Открытая» — без разряда и опыта. Короткая дистанция, понятная карта.',
  },
  {
    symbol: <ControlSymbol className="size-10" label="1" />,
    title: 'Подайте заявку',
    text: 'Онлайн за 2 минуты. Компас и чип выдадим на месте — нужна только удобная одежда.',
  },
  {
    symbol: <FinishSymbol className="size-10" />,
    title: 'Найдите клуб',
    text: 'Тренировки круглый год: летом в лесу, зимой — на лыжах и в зале. Первая неделя бесплатно.',
  },
]

export function Beginners() {
  return (
    <section
      id="beginners"
      aria-labelledby="beginners-title"
      className="contour-texture border-y border-border py-16 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading id="beginners-title" index="05" eyebrow="Новичкам" title="Первый старт — это просто" />
        </Reveal>

        <ol className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-11 hidden border-t-2 border-dashed border-course md:block"
          />
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 100} className="relative flex flex-col items-start gap-5 md:items-center md:text-center">
                <span className="relative z-10 flex size-[5.5rem] items-center justify-center rounded-full border border-border bg-card text-course shadow-sm">
                  {step.symbol}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Шаг {i + 1}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-12 flex justify-center">
          <a
            href="#calendar"
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-forest px-6 font-semibold text-paper transition hover:bg-forest-deep"
          >
            Подобрать первый старт
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
