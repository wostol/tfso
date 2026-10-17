import { Mail, MapPin, Phone } from 'lucide-react'
import { nav } from '@/lib/data'

const social = [
  { label: 'ВКонтакте', href: '#' },
  { label: 'Telegram', href: '#' },
  { label: 'YouTube', href: '#' },
]

export function SiteFooter() {
  return (
    <footer id="contacts" className="contour-texture-light bg-forest-deep text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-5">
          <p className="font-heading text-2xl font-extrabold tracking-tight">ТФСО</p>
          <p className="max-w-sm leading-relaxed text-paper/70">
            Томская региональная общественная организация «Федерация спортивного ориентирования».
            Аккредитована с 2004 года.
          </p>
          <ul className="flex flex-col gap-2.5 text-paper/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-open" />
              Томск, пр. Ленина, 36, оф. 214
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-open" />
              <a href="tel:+73822000000" className="font-mono tabular-nums hover:text-paper">
                +7 (3822) 00-00-00
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-open" />
              <a href="mailto:info@tfso.ru" className="hover:text-paper">
                info@tfso.ru
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Разделы сайта">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Разделы</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {nav.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-paper/85 transition hover:text-open">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-paper/50">Мы в сетях</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-paper/85 transition hover:text-open">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-paper/50 sm:flex-row sm:justify-between md:px-8">
          <p>© 2026 ТФСО</p>
          <p className="font-mono text-xs">М 1:10 000 · N 56°29′ E 84°57′</p>
        </div>
      </div>
    </footer>
  )
}
