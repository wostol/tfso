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

### ✅ 6. Тесты микросервиса (28 проверок)

```bash
docker compose exec api npm test
```

Запускает интеграционные тесты на встроенном PostgreSQL (PGlite) —
проверяет все маршруты, обработку ошибок, валидацию, без внешней БД.

## Что показать преподавателю

Рекомендуемый порядок демонстрации (10–15 минут):

1. **Структура проекта и архитектура** (1 минута)
   - Откройте этот README — покажите схему и таблицу стека.
   - Объясните: «Сайт не знает про БД. Он общается с микросервисом по HTTP.
     Микросервис знает про БД».

2. **Запуск** (1 минута)
   - `docker compose up --build -d`
   - `docker compose ps` — все три healthy
   - `./seed.sh` — наполнить данными

3. **Сайт работает** (3 минуты)
   - http://localhost:3000 — главная, прокомментируйте: «Это Server Component,
     данные приходят с сервера, не из браузера — нет CORS»
   - http://localhost:3000/events — покажите фильтр по статусу, поиск
   - Откройте завершённое событие — покажите таблицу результатов

4. **Связь сайт ↔ микросервис** (2 минуты) — КЛЮЧЕВОЙ момент
   - `docker compose stop api`
   - Обновите сайт: «Видите — сайт не упал. Показал понятное сообщение»
   - `docker compose start api`
   - Обновите: «Данные снова появились» — это и есть устойчивость связки

5. **Микросервис сам по себе** (3 минуты)
   - http://localhost:4000/docs — Swagger
   - Postman: создайте новое мероприятие, добавьте результат,
     попробуйте дубликат (получите 409)
   - `docker compose exec api npm test` — 28/28 PASS

6. **Multi-stage Docker** (1 минута)
   - Откройте `tfso-events-api/Dockerfile` — три стадии
   - Откройте `tfso-site/Dockerfile` — три стадии, `output: 'standalone'`
   - `docker images | grep tfso` — покажите размеры (без TypeScript, без dev-deps)

7. **Требования лабы — соответствие** (2 минуты)
   - Откройте таблицу ниже.

## Соответствие требованиям лабораторной работы

| №   | Требование                   | Где смотреть                                                                                                     |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | ≥4 запроса                   | 8 маршрутов: GET/POST/PATCH/DELETE на /api/events + GET/POST на /api/events/:id/results + GET /health            |
| 2   | Любой язык                   | TypeScript + Node.js 20 + Fastify (микросервис); TypeScript + Next.js (сайт)                                     |
| 3   | Реляционная СУБД             | PostgreSQL 16, Drizzle ORM, SQL-миграции                                                                         |
| 4   | Контейнеры                   | Dockerfile в 3 стадии (deps → build → runtime) и у сайта, и у микросервиса                                       |
| 5   | docker-compose + multi-stage | корневой `docker-compose.yml`: web + api + db, healthchecks, depends_on: service_healthy                         |
| 6   | Git-репозиторий              | инструкции ниже                                                                                                  |
| 7   | Postman                      | `tfso-events-api/postman/TFSO-Events-API.postman_collection.json` — 18 запросов                                  |
| 8   | Обработка ошибок             | Zod-валидация → 400 с детализацией по полям; 404/409; error-handler плагин; сайт имеет error.tsx и not-found.tsx |
| +   | Логирование (опц.)           | pino (микросервис) — структурированные логи; видны через `docker compose logs api`                               |
| +   | Swagger (опц.)               | http://localhost:4000/docs — OpenAPI 3 + Swagger UI                                                              |
| ++  | Связка с frontend            | **Бонус сверх требований**: демонстрация того, как сайт потребляет REST API                                      |

## Публикация на GitHub

### 1. Микросервис (отдельный репозиторий)

```bash
cd tfso-events-api
git init -b main
git add .
git commit -m "init: tfso-events-api v1.0 — Fastify + Drizzle + Postgres"
# создайте ПУБЛИЧНЫЙ репозиторий на GitHub, например tfso-events-api
git remote add origin git@github.com:<ваш-логин>/tfso-events-api.git
git push -u origin main
```

### 2. Сайт (в существующий репозиторий wostol/tfso)

```bash
cd tfso-site
git init -b main   # если ещё не инициализирован
git add .
git commit -m "feat: подключение к микросервису tfso-events-api

- lib/events-api.ts — типизированный клиент к /api/events
- /events и /events/[id] — календарь и страница с протоколом
- calendar.tsx и hero.tsx — async Server Components
- error.tsx, loading.tsx, not-found.tsx — устойчивость при сбое API
- Dockerfile multi-stage с output: 'standalone'
- EVENTS_API_URL — единственная переменная для адреса API"
git remote add origin git@github.com:wostol/tfso.git
   # --force если репозиторий уже был с другим кодом
```

### 3. (Опц.) Корневой репозиторий с docker-compose

Можно либо держать `docker-compose.yml` в одном из репозиториев, либо
сделать третий репозиторий `tfso-mvp`, который через git submodules
ссылается на оба:

```bash
mkdir tfso-mvp && cd tfso-mvp
git init -b main
git submodule add git@github.com:<ваш-логин>/tfso-events-api.git
git submodule add git@github.com:wostol/tfso.git tfso-site
# добавить docker-compose.yml и seed.sh из этого архива
git add .
git commit -m "init: tfso-mvp — docker-compose для сайт+микросервис+БД"
git remote add origin git@github.com:<ваш-логин>/tfso-mvp.git
git push -u origin main
```

Тогда преподаватель клонирует ОДИН репозиторий, делает `git submodule update --init`
и `docker compose up --build`.

## Остановка и очистка

```bash
docker compose down          # остановить и удалить контейнеры (данные БД сохранятся)
docker compose down -v       # то же + удалить том БД (полный сброс)
docker system prune -a       # очистить все неиспользуемые образы (если нужно место)
```

## Что дальше (на следующем этапе проекта)

- **Payload 3** — админка для новостей, страниц, карт (в микросервисе уже
  есть `events`/`results`; новость — другой тип контента, его логично
  отдать в Payload). Подключается в этот же Next.js-проект через
  `withPayload()` и postgres-адаптер.
- **Карта просмотрщик** (Leaflet + OSM) — на странице `/events/[id]`
  в секции «Как добраться» появится интерактивная карта.
- **Импорт SportOrg** —CSV/XML из SportOrg → массовый POST в
  `/api/events/:id/results` с SHA-256 идемпотентностью.

## Лицензия и авторство

Учебный проект для лабораторной работы по микросервисам. Дизайн сайта —
исходная лесная тема из `github.com/wostol/tfso`. Микросервис написан
изначально для этого проекта.
