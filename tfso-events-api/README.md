# TFSO Events API — REST-микросервис «Мероприятия и результаты»

Учебный микросервис федерации спортивного ориентирования (ТФСО, Томск). Выполнен как
лабораторная работа, но при этом это реальный фрагмент большого проекта — переписывания сайта
[orient.tomsk.ru](https://orient.tomsk.ru): предметная область (мероприятия, результаты,
статусы протоколов SportOrg) и технологический стек полностью совпадают с основным проектом.

## Связь с основным проектом сайта

- Сайт ТФСО — монолит на Next.js 15 + Payload CMS 3 + PostgreSQL.
- По мере роста из монолита выделяются отдельные сервисы. Первый кандидат — сервис результатов
  (приём и хранение протоколов с соревнований). Этот микросервис реализует именно эту область.
- Стек микросервиса = стек проекта: **TypeScript (Node.js 20)**, **PostgreSQL 16**,
  **Drizzle ORM**, **Docker + docker-compose**.

## Соответствие требованиям лабораторной работы

| № | Требование | Как выполнено |
|---|------------|----------------|
| 1 | Минимум 4 запроса | **8 маршрутов**: GET, POST, PATCH, DELETE (см. таблицу ниже) |
| 2 | Любой язык | **TypeScript** (Node.js 20), фреймворк Fastify |
| 3 | Реляционная СУБД | **PostgreSQL 16** + Drizzle ORM, SQL-миграции |
| 4 | Микросервис и СУБД в контейнерах | **Dockerfile в 3 стадии (multi-stage)**, приложение и БД запускаются вместе |
| 5 | docker-compose | `docker-compose.yml`: сервисы `app` + `db`, healthcheck, `depends_on: service_healthy` |
| 6 | Репозиторий в GitLab/GitHub | инструкция публикации ниже |
| 7 | Проверка через Postman | коллекция `postman/TFSO-Events-API.postman_collection.json` (18 запросов, включая негативные) |
| 8 | Обработка ошибок | Zod-валидация → **400** с описанием полей, **404**, **409**, **500**; сервис не «падает» (см. тесты) |
| + | Логирование (опц.) | **pino**: структурированные логи запросов и ошибок |
| + | Swagger (опц.) | OpenAPI 3 + Swagger UI на `/docs` |
| ++ | Бонус: тесты | `npm test` — 28 интеграционных проверок на встроенном PostgreSQL (PGlite) |

## Быстрый старт

```bash
git clone https://github.com/<ваш-логин>/tfso-events-api.git
cd tfso-events-api
docker compose up --build
```

После старта:

| Что | Где |
|-----|-----|
| API | http://localhost:3000/api/events |
| Swagger UI | http://localhost:3000/docs |
| PostgreSQL | контейнер `db`, порт 5432 (user/db: `tfso`, пароль: `tfso`) |

При старте приложение само применяет SQL-миграции (папка `drizzle/`) — база готова к первому запросу.

## API

| Метод | Путь | Описание | Коды |
|-------|------|----------|------|
| GET | `/health` | Проверка работоспособности | 200 |
| GET | `/api/events` | Список: фильтры `status`, `search`, пагинация `limit`/`offset` | 200, 400 |
| POST | `/api/events` | Создать мероприятие | 201, 400 |
| GET | `/api/events/:id` | Получить мероприятие | 200, 400, 404 |
| PATCH | `/api/events/:id` | Частичное обновление | 200, 400, 404 |
| DELETE | `/api/events/:id` | Удалить (результаты удаляются каскадом) | 204, 400, 404 |
| GET | `/api/events/:eventId/results` | Протокол с распределением мест | 200, 400, 404 |
| POST | `/api/events/:eventId/results` | Добавить результат участника | 201, 400, 404, 409 |

### Примеры

Создание мероприятия:

```bash
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Открытие сезона 2026","eventDate":"2026-05-16","location":"Томск, сосновый бор","discipline":"Заданное направление"}'
```

Ошибка валидации (некорректные данные — сервис продолжает работать):

```bash
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"А","eventDate":"16.05.2026","location":"Т"}'
# HTTP 400
# {
#   "error": "Некорректное тело запроса",
#   "details": [
#     { "path": "title", "message": "Название должно содержать минимум 3 символа" },
#     { "path": "eventDate", "message": "Дата должна быть в формате YYYY-MM-DD" },
#     { "path": "location", "message": "Укажите место проведения (минимум 2 символа)" }
#   ]
# }
```

Добавление результата и протокол с местами:

```bash
curl -s -X POST http://localhost:3000/api/events/<id>/results \
  -H "Content-Type: application/json" \
  -d '{"athleteName":"Иванов Иван","team":"ТФСО","timeSeconds":1830,"status":"OK"}'

curl -s http://localhost:3000/api/events/<id>/results
# place: 1 — Петров (29:15), place: 2 — Иванов (30:30), place: null — Сидоров (DNF, сошёл)
```

## Проверка в Postman

1. **Import** → `postman/TFSO-Events-API.postman_collection.json`.
2. Переменная коллекции `baseUrl` по умолчанию `http://localhost:3000`.
3. Сначала выполните **Events / 02 Создать мероприятие** — тест-скрипт автоматически сохранит
   `eventId` в переменную коллекции, остальные запросы подставят его сами.
4. Папка **Негативные сценарии** проверяетcodes 400/404/409 — удобно для отчёта по обработке ошибок.

## Обработка ошибок

| Код | Когда возвращается |
|-----|--------------------|
| 400 | Ошибки валидации (Zod): указывается каждое проблемное поле; некорректный JSON; неверный UUID |
| 404 | Мероприятие не найдено; неизвестный маршрут |
| 409 | Дубликат результата участника на мероприятии (уникальный индекс в СУБД) |
| 500 | Непредвиденная ошибка: клиенту — безопасное сообщение, полный стек — в лог |

Принцип: некорректный ввод **никогда не роняет сервис** — глобальный обработчик
(`src/plugins/error-handler.ts`) превращает любые ошибки в аккуратный JSON-ответ.
Это подтверждено smoke-тестами (`tests/smoke.ts`).

## Логирование

- HTTP-запросы и ответы — встроенный pino-логгер Fastify (`method`, `url`, `statusCode`, время).
- Ошибки валидации — уровень `warn`, внутренние — `error` с полным стеком.
- В development логи цветные (`pino-pretty`), в production — структурированный JSON.

## Архитектура и multi-stage сборка

```
tfso-events-api/
├── src/
│   ├── index.ts              # точка входа: конфиг → БД → миграции → HTTP-сервер
│   ├── app.ts                # фабрика приложения (Fastify, DI экземпляра БД)
│   ├── config.ts             # валидация переменных окружения (Zod)
│   ├── errors.ts             # AppError + helper валидации parseOrThrow
│   ├── db/
│   │   ├── schema.ts         # таблицы events, results (Drizzle)
│   │   ├── client.ts         # пул подключений pg + Drizzle
│   │   └── migrate.ts        # применение SQL-миграций при старте
│   ├── modules/
│   │   ├── events/           # схемы, сервис, маршруты мероприятий
│   │   └── results/          # схемы, сервис, маршруты результатов
│   └── plugins/
│       ├── error-handler.ts  # глобальная обработка ошибок
│       └── swagger.ts        # OpenAPI + Swagger UI (/docs)
├── drizzle/                  # сгенерированные SQL-миграции
├── tests/smoke.ts            # 28 интеграционных проверок (PGlite)
├── postman/                  # коллекция Postman
├── Dockerfile                # multi-stage: deps → build → runtime
└── docker-compose.yml        # app + postgres, healthcheck
```

**Зачем multi-stage.** Стадия 1 (`deps`) ставит все зависимости; стадия 2 (`build`) компилирует
TypeScript; стадия 3 (`runtime`) забирает только собранный `dist/`, прод-зависимости и миграции.
Итоговый образ не содержит исходников, TypeScript и dev-инструментов — он меньше, быстрее
и безопаснее; приложение работает от непривилегированного пользователя `appuser`.

**Зачем healthcheck в compose.** Приложение стартует только когда PostgreSQL реально готов
принимать подключения (`pg_isready`), — а не просто когда контейнер запущен.

## Разработка без Docker

Нужен локальный PostgreSQL и Node.js 20+:

```bash
cp .env.example .env          # укажите DATABASE_URL под свою локальную БД
npm install
npm run db:generate           # сгенерировать миграцию после правок схемы (src/db/schema.ts)
npm run dev                   # tsx watch, логи в красивом формате
npm test                      # интеграционные тесты (PostgreSQL не нужен — PGlite)
npm run build && npm start    # прод-сборка
```

## Публикация на GitHub/GitLab

Репозиторий уже инициализирован (git, ветка `main`, история коммитов). Осталось:

```bash
# создайте пустой ПУБЛИЧНЫЙ репозиторий tfso-events-api на GitHub/GitLab, затем:
cd tfso-events-api
git remote add origin git@github.com:<ваш-логин>/tfso-events-api.git
git push -u origin main
```

Публичность обязательна — преподаватель должен иметь возможность clone/fork.
Если нужно сменить автора коммитов: `git config user.name "Ваше Имя"` и
`git config user.email "you@example.com"`, затем `git commit --amend --reset-author`.
