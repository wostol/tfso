# TFSO MVP — связка «сайт ↔ микросервис» федерации спортивного ориентирования

Учебный и одновременно реальный MVP: сайт ТФСО на Next.js 16, который получает
данные о мероприятиях и результатах из отдельного REST-микросервиса на Fastify.
Оба сервиса и БД PostgreSQL запускаются одной командой через Docker Compose.

```
┌──────────────────┐        HTTP          ┌──────────────────┐         pg        ┌─────────────┐
│   tfso-web       │ ──────────────────► │   tfso-api       │ ────────────────► │   tfso-db   │
│   Next.js 16     │   http://api:3000    │   Fastify        │   postgres://…   │  Postgres16 │
│   React 19       │                      │   TypeScript     │                   │             │
│   Tailwind 4     │                      │   Drizzle ORM    │                   │             │
│   shadcn/ui 4    │ ◄──── (browser) ──── │   Zod валидация  │ ◄─── (Postman) ── │             │
│   :3000 (host)   │   http://localhost   │   :4000 (host)   │                   │ :5432(host) │
│                  │   :3000              │   :3000 (intra)  │                   │             │
└──────────────────┘                      └──────────────────┘                   └─────────────┘
```

## Состав проекта

```
tfso-mvp/
├── docker-compose.yml           # поднимает web + api + db одной командой
├── seed.sh                      # наполнение демо-данными (6 событий, 14 результатов)
├── README.md                    # этот файл
│
├── tfso-site/                   # Next.js сайт (ваш github.com/wostol/tfso)
│   ├── app/
│   │   ├── page.tsx              # Главная: hero, новости, календарь (из API), результаты
│   │   ├── events/page.tsx       # /events — календарь с фильтрами и пагинацией
│   │   ├── events/[id]/page.tsx  # /events/:id — событие + протокол результатов
│   │   ├── loading.tsx           # глобальный loading-скелетон
│   │   ├── error.tsx             # глобальный error-boundary (если API упал)
│   │   └── not-found.tsx         # 404 для несуществующих мероприятий
│   ├── components/tfso/          # компоненты сайта
│   │   ├── calendar.tsx          #   ← ASYNC: fetch /api/events
│   │   ├── hero.tsx              #   ← ASYNC: fetch ближайшего события для countdown
│   │   ├── event-card.tsx        #   переиспользуемая карточка события
│   │   ├── event-filters.tsx     #   ← CLIENT: статус + поиск → URL searchParams
│   │   ├── results-table.tsx     #   таблица протокола (place, athlete, time, status)
│   │   ├── event-status-badge.tsx #  бейджи для статусов (EventStatus + ResultStatus)
│   │   └── …                     #   остальное из исходного v0-дизайна
│   ├── lib/
│   │   ├── events-api.ts         # ← ЕДИНСТВЕННЫЙ файл, знающий URL микросервиса
│   │   ├── data.ts               #   новости, клубы, навигация (в будущем → Payload)
│   │   └── utils.ts
│   ├── Dockerfile                # multi-stage (deps → builder → runner), pnpm
│   ├── .env.example              #   EVENTS_API_URL=http://localhost:4000
│   └── next.config.mjs           #   output: 'standalone' для Docker
│
└── tfso-events-api/             # микросервис «Мероприятия и результаты»
    ├── src/
    │   ├── index.ts              # точка входа: config → БД → миграции → HTTP-сервер
    │   ├── app.ts                # сборка Fastify (роуты + swagger + error-handler)
    │   ├── modules/events/       # CRUD мероприятий
    │   ├── modules/results/      # протокол с распределением мест
    │   ├── plugins/              # error-handler (400/404/409/500) + Swagger
    │   └── db/                   # Drizzle schema + миграции + клиент
    ├── drizzle/0000_init.sql    # SQL-миграция (применяется при старте)
    ├── tests/smoke.ts           # 28 интеграционных тестов (на встроенном PGlite)
    ├── postman/                 # коллекция Postman (18 запросов, негативные сценарии)
    ├── Dockerfile               # multi-stage (deps → build → runtime)
    └── README.md                # детальное описание микросервиса
```

## Стек технологий

| Слой        | Технология                       | Почему                                                                                          |
| ----------- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Сайт        | **Next.js 16 + React 19**        | App Router, Server Components — данные тянутся на сервере, нет CORS, хороший SEO                |
| Стили       | **Tailwind CSS 4 + shadcn/ui 4** | дизайн-система «лесной ориентир» из исходного репо сохранена без изменений                      |
| Микросервис | **Fastify 5 + TypeScript**       | лёгкий HTTP-фреймворк, OpenAPI из коробки                                                       |
| БД          | **PostgreSQL 16**                | реляционная СУБД, требование лабы                                                               |
| ORM         | **Drizzle**                      | типизированный SQL, читаемые миграции, один ORM на сайт и микросервис (когда подключим Payload) |
| Контейнеры  | **Docker + docker-compose**      | multi-stage Dockerfiles, healthchecks, depends_on: service_healthy                              |

## Быстрый старт — 4 команды

```bash
# 1. Распаковать (если ещё не распакован)
unzip tfso-mvp.zip && cd tfso-mvp

# 2. Поднять весь стек (сайт + микросервис + БД)
docker compose up --build -d

# 3. Дождаться готовности (~30 сек) — проверяем:
docker compose ps
# Все три сервиса должны быть (healthy)

# 4. Наполнить демо-данными
./seed.sh
```

После запуска:

| Что                         | URL                                   |
| --------------------------- | ------------------------------------- |
| Сайт ТФСО                   | http://localhost:3000                 |
| Календарь                   | http://localhost:3000/events          |
| Страница события + протокол | http://localhost:3000/events/<id>     |
| API — список мероприятий    | http://localhost:4000/api/events      |
| API — Swagger UI            | http://localhost:4000/docs            |
| API — health-check          | http://localhost:4000/health          |
| PostgreSQL                  | localhost:5432 (user/db/pass: `tfso`) |

## Как проверить, что всё работает — чек-лист

### ✅ 1. Стек запущен

```bash
docker compose ps
```

Ожидаем: `tfso-db` (healthy), `tfso-api` (healthy), `tfso-web` (up).

```bash
curl -s http://localhost:4000/health
# {"status":"ok","timestamp":"2026-..."}
```

### ✅ 2. Сайт получает данные из микросервиса

Откройте в браузере:

- **http://localhost:3000** — на главной в блоке «Календарь соревнований»
  должны появиться 4–6 карточек мероприятий. В блоке «До ближайшего старта»
  (в hero) — живой обратный отсчёт.
- **http://localhost:3000/events** — тот же календарь с фильтрами статуса
  и поиском. Попробуйте выбрать «Завершено» и нажать «Найти» — URL
  обновится до `/events?status=finished`, а сервер заново запросит API.
- **http://localhost:3000/events/<id-завершённого-события>** — кликните
  на завершённое событие в календаре. На странице должна быть таблица
  «Протокол результатов» с распределением мест и нештатными статусами
  DNF/DSQ/DNS/OTL (как в протоколах SportOrg).

### ✅ 3. Связь «сайт ↔ микросервис» работает

Остановите **только** контейнер API:

```bash
docker compose stop api
```

Обновите http://localhost:3000 — в блоке календаря появится аккуратное
сообщение «Микросервис временно недоступен», а в hero исчезнет блок
обратного отсчёта. Сам сайт **не падает** — это важная демонстрация
устойчивости: при восстановлении API данные снова появятся.

Запустите API обратно:

```bash
docker compose start api
```

### ✅ 4. API проверяется через Postman

Импортируйте в Postman:

```
tfso-events-api/postman/TFSO-Events-API.postman_collection.json
```

Переменная коллекции `baseUrl` = `http://localhost:4000`. Запустите запрос
**Events / 02 Создать мероприятие** — его тест-скрипт автоматически сохранит
`eventId` в переменную коллекции, и все последующие запросы про этот event
(обновление, удаление, результаты) подхватят его.

Папка **Негативные сценарии** проверяет 400/404/409 — для отчёта по
обработке ошибок.

### ✅ 5. API задокументирован (Swagger)

Откройте http://localhost:4000/docs — это автоматически сгенерированный
Swagger UI из схем маршрутов. Все типы запросов/ответов — там.
