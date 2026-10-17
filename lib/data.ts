export type RegistrationStatus = 'open' | 'soon' | 'closed' | 'finished'

export type TfsoEvent = {
  id: string
  title: string
  start: string
  place: string
  discipline: string
  status: RegistrationStatus
  statusNote: string
  action: { label: string; href: string }
}

export const events: TfsoEvent[] = [
  {
    id: 'cup-final',
    title: 'Кубок Томска — финальный этап',
    start: '2026-10-25T11:00:00+07:00',
    place: 'Лагерный сад',
    discipline: 'Спринт',
    status: 'open',
    statusNote: 'Заявка открыта до 23.10',
    action: { label: 'Подать заявку', href: '#' },
  },
  {
    id: 'region-champ',
    title: 'Чемпионат области «Осенний азимут»',
    start: '2026-11-01T10:30:00+07:00',
    place: 'Басандайка',
    discipline: 'Классика',
    status: 'open',
    statusNote: 'Заявка до 27.10, 23:59',
    action: { label: 'Положение', href: '#' },
  },
  {
    id: 'night',
    title: 'Ночное ориентирование «Фонарик»',
    start: '2026-11-07T18:30:00+07:00',
    place: 'Михайловская роща',
    discipline: 'Ночь',
    status: 'soon',
    statusNote: 'Регистрация с 25.10',
    action: { label: 'Положение', href: '#' },
  },
  {
    id: 'relay',
    title: 'Клубная эстафета «Первый снег»',
    start: '2026-11-14T12:00:00+07:00',
    place: 'Академгородок',
    discipline: 'Эстафета',
    status: 'soon',
    statusNote: 'Регистрация с 01.11',
    action: { label: 'Положение', href: '#' },
  },
  {
    id: 'park-tour',
    title: 'Парковый тур — 6 этап',
    start: '2026-10-11T11:00:00+07:00',
    place: 'Университетская роща',
    discipline: 'Парк',
    status: 'finished',
    statusNote: '214 участников',
    action: { label: 'Протокол', href: '#' },
  },
]

export const deadline = {
  id: 'region-champ-2026',
  text: 'Приём заявок на Чемпионат области «Осенний азимут» закрывается',
  dueLabel: '27 октября в 23:59',
  due: '2026-10-27T23:59:00+07:00',
  actionLabel: 'Подать заявку',
}

export const news = [
  {
    id: 1,
    tag: 'Соревнования',
    date: '2026-10-12',
    title: 'Парковый тур в Университетской роще собрал рекордные 214 участников',
    excerpt:
      'Шестой этап прошёл в тумане раннего утра: короткие перегоны, плотная сеть тропинок и много новичков в группе «Открытая».',
    image: '/images/news-autumn.png',
    alt: 'Спортсмен с картой бежит через осенний березовый лес мимо контрольного пункта',
  },
  {
    id: 2,
    tag: 'Карты',
    date: '2026-10-08',
    title: 'Обновлена карта района Басандайка: 6,2 км² после летней корректировки',
    excerpt: 'Новые вырубки, перенесённые просеки и уточнённый рельеф северного склона.',
    image: '/images/hero-map.png',
    alt: 'Фрагмент спортивной карты с горизонталями и растительностью',
    isMap: true,
  },
  {
    id: 3,
    tag: 'Сборная',
    date: '2026-10-02',
    title: 'Состав сборной области на лыжный сезон 2026/27',
    excerpt: 'Тренерский совет утвердил 18 спортсменов и план сборов в Кузбассе.',
    image: '/images/news-winter.png',
    alt: 'Лыжник-ориентировщик в зимнем сосновом лесу на солнце',
  },
  {
    id: 4,
    tag: 'Федерация',
    date: '2026-09-27',
    title: 'Школа судей: набор на осенний курс открыт',
    excerpt: 'Восемь занятий — от работы на старте до обработки результатов.',
    image: '/images/news-start.png',
    alt: 'Стартовый коридор соревнований в летнем сосновом бору',
  },
]

export const protocols = [
  { title: 'Парковый тур — 6 этап', date: '2026-10-11', meta: 'Сплиты · HTML' },
  { title: 'Первенство ТГУ, спринт', date: '2026-10-04', meta: 'PDF · 412 КБ' },
  { title: 'Кубок Томска — 4 этап', date: '2026-09-27', meta: 'Сплиты · HTML' },
  { title: 'Чемпионат области, лонг', date: '2026-09-20', meta: 'PDF · 1,1 МБ' },
]

export const documents = [
  { title: 'Положение о Чемпионате области 2026', date: '2026-10-01', meta: 'PDF · 380 КБ' },
  { title: 'Календарный план 2027 — проект', date: '2026-09-30', meta: 'PDF · 220 КБ' },
  { title: 'Правила вида спорта (ред. 2025)', date: '2025-12-15', meta: 'PDF · 2,4 МБ' },
  { title: 'Устав федерации', date: '2024-03-12', meta: 'PDF · 640 КБ' },
]

export const clubs = [
  { name: 'Азимут-ТПУ', short: 'АЗ', members: 86, color: '#2e6b3f' },
  { name: 'Северный ветер', short: 'СВ', members: 54, color: '#a8247c' },
  { name: 'Кедр', short: 'КД', members: 41, color: '#a9662e' },
  { name: 'ТГУ-Ориент', short: 'ТГ', members: 73, color: '#10241a' },
  { name: 'Лесная тропа', short: 'ЛТ', members: 29, color: '#d4861a' },
  { name: 'Маршрут 70', short: '70', members: 37, color: '#3f7f8f' },
]

export const nav = [
  { label: 'Календарь', href: '#calendar' },
  { label: 'Результаты', href: '#results' },
  { label: 'Новости', href: '#news' },
  { label: 'Клубы', href: '#results' },
  { label: 'Новичкам', href: '#beginners' },
  { label: 'Контакты', href: '#contacts' },
]

export function formatDateRu(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString('ru-RU', { timeZone: 'Asia/Tomsk', ...opts })
}
