/**
 * Интеграционный smoke-тест: запускает реальное приложение
 * на встроенном PostgreSQL (PGlite — официальный Postgres, скомпилированный в WebAssembly),
 * применяет настоящие SQL-миграции и прогоняет все маршруты через fastify.inject()
 * (HTTP-запросы без сетевого сокета).
 *
 * Запуск: npm test
 */
import assert from 'node:assert';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzleForPglite } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

import { buildApp } from '../src/app';
import { loadConfig } from '../src/config';

// Значения по умолчанию для тестовой среды.
// DATABASE_URL задаётся принудительно: реальное подключение не используется,
// данные живут во встроенном PGlite, а строка нужна только валидатору конфигурации.
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';
process.env.NODE_ENV ??= 'test';
process.env.LOG_LEVEL ??= 'error';

const UUID_MISSING = '00000000-0000-4000-8000-000000000000';

async function main(): Promise<void> {
  // 1. Поднимаем встроенный PostgreSQL и применяем настоящие миграции
  const pglite = new PGlite();
  const db = drizzleForPglite(pglite);
  await migrate(db, { migrationsFolder: 'drizzle' });

  // 2. Собираем приложение (тот же buildApp, что и в production)
  const config = loadConfig();
  const app = await buildApp(db, config);

  let passed = 0;
  const check = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      passed += 1;
      console.log(`  ✅ ${name}`);
    } catch (error) {
      console.error(`  ❌ ${name}`);
      throw error;
    }
  };

  let eventId = '';
  let event2Id = '';

  // ---------- System ----------
  console.log('\nSystem:');
  await check('GET /health → 200, status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().status, 'ok');
  });

  // ---------- Events: CRUD ----------
  console.log('\nEvents (CRUD):');
  await check('GET /api/events на пустой БД → 200, total = 0', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().meta.total, 0);
    assert.deepEqual(res.json().data, []);
  });

  await check('POST /api/events → 201, мероприятие создано', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/events',
      payload: {
        title: 'Открытие сезона 2026',
        eventDate: '2026-05-16',
        location: 'Томск, сосновый бор',
        discipline: 'Заданное направление',
        description: 'Первые старты весеннего календаря',
      },
    });
    assert.equal(res.statusCode, 201);
    const body = res.json();
    assert.equal(body.status, 'upcoming');
    assert.equal(body.title, 'Открытие сезона 2026');
    eventId = body.id;
    assert.match(eventId, /^[0-9a-f-]{36}$/);
  });

  await check('POST /api/events → 201 (второе, статус finished)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/events',
      payload: {
        title: 'Кубок Томска, зимний этап',
        eventDate: '2026-02-21',
        location: 'Киселёвская сосна',
        status: 'finished',
      },
    });
    assert.equal(res.statusCode, 201);
    event2Id = res.json().id;
    assert.equal(event2Id, res.json().id);
  });

  await check('POST /api/events с некорректными данными → 400 + детали', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/events',
      payload: { title: 'А', eventDate: '16.05.2026', location: 'Т' },
    });
    assert.equal(res.statusCode, 400);
    const body = res.json();
    assert.ok(body.error);
    assert.ok(Array.isArray(body.details) && body.details.length >= 3);
  });

  await check('GET /api/events/:id → 200', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/events/${eventId}` });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().id, eventId);
  });

  await check('GET /api/events/:id (несуществующий UUID) → 404', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/events/${UUID_MISSING}` });
    assert.equal(res.statusCode, 404);
    assert.match(res.json().error, /не найдено/);
  });

  await check('GET /api/events/:id (не UUID) → 400', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events/abc' });
    assert.equal(res.statusCode, 400);
  });

  await check('PATCH /api/events/:id → 200, статус обновлён', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/events/${event2Id}`,
      payload: { status: 'finished', title: 'Кубок Томска — зимний этап' },
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().status, 'finished');
  });

  await check('PATCH с пустым телом → 400', async () => {
    const res = await app.inject({ method: 'PATCH', url: `/api/events/${event2Id}`, payload: {} });
    assert.equal(res.statusCode, 400);
  });

  await check('PATCH с неизвестными полями → 400', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/events/${event2Id}`,
      payload: { unknownField: 1 },
    });
    assert.equal(res.statusCode, 400);
  });

  await check('GET /api/events?status=upcoming → фильтр работает', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events?status=upcoming' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().meta.total, 1);
    assert.equal(res.json().data[0].id, eventId);
  });

  await check('GET /api/events?search=сосновый → поиск работает', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events?search=сосновый' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().meta.total, 1);
  });

  await check('GET /api/events?limit=abc → 400', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/events?limit=abc' });
    assert.equal(res.statusCode, 400);
  });

  // ---------- Results ----------
  console.log('\nResults:');
  await check('POST результат (OK, время) → 201, время отформатировано', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Иванов Иван', team: 'ТФСО', birthYear: 1995, timeSeconds: 1830 },
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.json().timeFormatted, '00:30:30');
    assert.equal(res.json().status, 'OK');
  });

  await check('POST результат (второй участник, быстрее) → 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Петров Пётр', team: 'СибАО', timeSeconds: 1755 },
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.json().timeFormatted, '00:29:15');
  });

  await check('POST дубликат участника → 409', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Иванов Иван', timeSeconds: 2000 },
    });
    assert.equal(res.statusCode, 409);
  });

  await check('POST результат DNF (без времени) → 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Сидоров Сидор', status: 'DNF' },
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.json().timeSeconds, null);
  });

  await check('POST результат OK без времени → 400', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Кузнецов Ким' },
    });
    assert.equal(res.statusCode, 400);
  });

  await check('POST результат DNF со временем → 400', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${eventId}/results`,
      payload: { athleteName: 'Кузнецов Ким', status: 'DNF', timeSeconds: 100 },
    });
    assert.equal(res.statusCode, 400);
  });

  await check('POST результат на несуществующее мероприятие → 404', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/events/${UUID_MISSING}/results`,
      payload: { athleteName: 'Тестов Тест', timeSeconds: 100 },
    });
    assert.equal(res.statusCode, 404);
  });

  await check('GET результаты: места по времени, DNF в конце (place = null)', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/events/${eventId}/results` });
    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.meta.total, 3);
    assert.equal(body.meta.finished, 2);
    assert.equal(body.data[0].athleteName, 'Петров Пётр'); // 29:15
    assert.equal(body.data[0].place, 1);
    assert.equal(body.data[1].athleteName, 'Иванов Иван'); // 30:30
    assert.equal(body.data[1].place, 2);
    assert.equal(body.data[2].athleteName, 'Сидоров Сидор');
    assert.equal(body.data[2].place, null);
  });

  // ---------- Ошибки и устойчивость ----------
  console.log('\nОшибки:');
  await check('Неизвестный маршрут → 404 (JSON, а не HTML)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/nope' });
    assert.equal(res.statusCode, 404);
    assert.match(res.json().error, /не найден/);
  });

  await check('Некорректный JSON в теле → 400, сервис не падает', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/events',
      payload: '{ это не json',
      headers: { 'content-type': 'application/json' },
    });
    assert.equal(res.statusCode, 400);
  });

  await check('После ошибок сервис продолжает работать', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    assert.equal(res.statusCode, 200);
  });

  // ---------- DELETE + каскад ----------
  console.log('\nУдаление:');
  await check('DELETE /api/events/:id → 204', async () => {
    const res = await app.inject({ method: 'DELETE', url: `/api/events/${eventId}` });
    assert.equal(res.statusCode, 204);
  });

  await check('После удаления GET мероприятия → 404', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/events/${eventId}` });
    assert.equal(res.statusCode, 404);
  });

  await check('Каскадное удаление: результаты мероприятия тоже удалены (404)', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/events/${eventId}/results` });
    assert.equal(res.statusCode, 404);
  });

  await app.close();
  console.log(`\n🧪 Все smoke-тесты пройдены: ${passed} проверок`);
  process.exit(0);
}

main().catch((error) => {
  console.error('\n💥 Smoke-тесты упали:', error);
  process.exit(1);
});
