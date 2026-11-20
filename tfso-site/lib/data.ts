// Мероприятия больше не хранятся статически — они приходят из микросервиса
// tfso-events-api (см. lib/events-api.ts). Новости, документы, клубы и
// навигация останутся статичными до подключения Payload CMS на следующем
// этапе проекта.

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
  { label: 'Календарь', href: '/events' },
  { label: 'Результаты', href: '#results' },
  { label: 'Новости', href: '#news' },
  { label: 'Клубы', href: '#results' },
  { label: 'Новичкам', href: '#beginners' },
  { label: 'Контакты', href: '#contacts' },
]

export function formatDateRu(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString('ru-RU', { timeZone: 'Asia/Tomsk', ...opts })
}
