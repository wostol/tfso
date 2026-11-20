#!/usr/bin/env node
/**
 * seed.mjs — наполнение микросервиса демонстрационными мероприятиями и
 * результатами. Кроссплатформенная версия (Windows / macOS / Linux):
 * использует только встроенный fetch из Node.js 18+, ничего устанавливать
 * не нужно — ни jq, ни curl.
 *
 * Запуск (после `docker compose up -d`):
 *   node seed.mjs
 *   API_URL=http://localhost:4000 node seed.mjs   # другой адрес API
 *
 * Повторный запуск безопасен: если демо-данные уже есть, скрипт выйдет.
 */

const API = process.env.API_URL ?? 'http://localhost:4000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Ждём, пока микросервис станет доступен (после docker compose up он стартует не мгновенно) */
async function waitForApi(timeoutSeconds = 60) {
  const deadline = Date.now() + timeoutSeconds * 1000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${API}/health`);
      if (res.ok) return;
    } catch {
      /* ещё не поднялся — пробуем дальше */
    }
    await sleep(1500);
  }
  throw new Error(`Микросервис не отвечает на ${API} за ${timeoutSeconds} с. ` +
    'Проверьте: docker compose ps (все сервисы должны быть healthy)');
}

/** Вызов API с понятной ошибкой вместо молчаливого падения */
async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const details = body.details
      ? ' → ' + body.details.map((d) => `${d.path}: ${d.message}`).join('; ')
      : '';
    throw new Error(`${options.method ?? 'GET'} ${path} → ${res.status}: ${body.error ?? res.statusText}${details}`);
  }
  return res.status === 204 ? null : res.json();
}

async function main() {
  console.log(`Проверка микросервиса ${API}…`);
  await waitForApi();
  console.log('✓ Микросервис доступен\n');

  // ---------- Защита от повторного запуска ----------
  const probe = await api(`/api/events?search=${encodeURIComponent('Снежный азимут')}&limit=1`);
  if (probe.meta.total > 0) {
    console.log('Демо-данные уже добавлены — ничего не делаем.');
    console.log('Чтобы начать с чистой базы: docker compose down -v && docker compose up -d');
    return;
  }

  // ---------- 1. Мероприятия ----------
  console.log('Создаём мероприятия…');

  const createEvent = async (payload) => {
    const created = await api('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log(`  ✓ ${created.title} (${created.eventDate}, ${created.status})`);
    return created.id;
  };

  const upcoming1 = await createEvent({
    title: 'Открытие зимнего сезона 2026',
    eventDate: '2026-12-05',
    location: 'Лагерный сад, Томск',
    discipline: 'Спринт',
    status: 'upcoming',
    description: 'Традиционное открытие зимнего сезона: короткая дистанция в городском лесу, подходит для новичков.',
  });
  const upcoming2 = await createEvent({
    title: 'Чемпионат области «Снежный азимут»',
    eventDate: '2026-12-20',
    location: 'Басандайка',
    discipline: 'Классика',
    status: 'upcoming',
    description: 'Главный старт зимы: длинная дистанция, сложный рельеф, отбор на регион. Приём заявок на orgeo.ru.',
  });
  const upcoming3 = await createEvent({
    title: 'Новогодний спринт-турнир',
    eventDate: '2027-01-07',
    location: 'Михайловская роща',
    discipline: 'Ночь',
    status: 'upcoming',
    description: 'Праздничный ночной старт с фонарём. Обязательна световозвращающая одежда.',
  });
  const upcoming4 = await createEvent({
    title: 'Кубок Сибири 2027 — 1 этап',
    eventDate: '2027-02-15',
    location: 'Академгородок, Томск',
    discipline: 'Эстафета',
    status: 'upcoming',
    description: 'Командная эстафета 3×3 км среди клубов Сибири. Регистрация команд через сайт федерации.',
  });
  const finished1 = await createEvent({
    title: 'Парковый тур — 6 этап',
    eventDate: '2026-10-11',
    location: 'Университетская роща',
    discipline: 'Парк',
    status: 'finished',
    description: 'Шестой этап паркового тура собрал рекордные 214 участников.',
  });
  const finished2 = await createEvent({
    title: 'Кубок Томска — 4 этап',
    eventDate: '2026-09-27',
    location: 'Сосновый бор',
    discipline: 'Классика',
    status: 'finished',
    description: 'Четвёртый этап Кубка Томска. Тёплая осенняя погода, быстрая дистанция.',
  });

  console.log(`✓ Создано мероприятий: 6\n`);

  // ---------- 2. Результаты к завершённым мероприятиям ----------
  const addResult = async (eventId, r) => {
    await api(`/api/events/${eventId}/results`, {
      method: 'POST',
      body: JSON.stringify(r),
    });
    console.log(`  ✓ ${r.athleteName} — ${r.status}${r.timeSeconds ? ' ' + r.timeSeconds + ' c' : ''}`);
  };

  console.log('Результаты: «Парковый тур — 6 этап»…');
  await addResult(finished1, { athleteName: 'Петров Алексей', team: 'Азимут-ТПУ', birthYear: 1998, timeSeconds: 1755, status: 'OK' });
  await addResult(finished1, { athleteName: 'Иванов Дмитрий', team: 'Кедр', birthYear: 2001, timeSeconds: 1830, status: 'OK' });
  await addResult(finished1, { athleteName: 'Смирнова Анна', team: 'ТГУ-Ориент', birthYear: 1995, timeSeconds: 1912, status: 'OK' });
  await addResult(finished1, { athleteName: 'Кузнецов Иван', team: 'Азимут-ТПУ', birthYear: 2002, timeSeconds: 1968, status: 'OK' });
  await addResult(finished1, { athleteName: 'Соколова Мария', team: 'Северный ветер', birthYear: 1999, timeSeconds: 2050, status: 'OK' });
  await addResult(finished1, { athleteName: 'Орлов Сергей', team: 'Лесная тропа', birthYear: 1988, timeSeconds: 2147, status: 'OK' });
  // Нештатные статусы — как в протоколах SportOrg
  await addResult(finished1, { athleteName: 'Волков Андрей', team: 'Кедр', birthYear: 1990, status: 'DNF' });
  await addResult(finished1, { athleteName: 'Зайцева Ольга', team: 'ТГУ-Ориент', birthYear: 2003, status: 'DSQ' });
  await addResult(finished1, { athleteName: 'Морозов Павел', team: 'Маршрут 70', birthYear: 1978, status: 'DNS' });
  await addResult(finished1, { athleteName: 'Лебедев Артём', team: 'Азимут-ТПУ', birthYear: 2000, status: 'OTL' });

  console.log('\nРезультаты: «Кубок Томска — 4 этап»…');
  await addResult(finished2, { athleteName: 'Никитин Роман', team: 'Азимут-ТПУ', birthYear: 1992, timeSeconds: 2410, status: 'OK' });
  await addResult(finished2, { athleteName: 'Григорьева Елена', team: 'Северный ветер', birthYear: 1996, timeSeconds: 2530, status: 'OK' });
  await addResult(finished2, { athleteName: 'Фёдоров Михаил', team: 'Кедр', birthYear: 1985, timeSeconds: 2645, status: 'OK' });
  await addResult(finished2, { athleteName: 'Алексеева Дарья', team: 'ТГУ-Ориент', birthYear: 2004, timeSeconds: 2720, status: 'OK' });

  // ---------- Итог ----------
  const total = await api('/api/events?limit=1');
  console.log(`\n🎉 Готово! В базе ${total.meta.total} мероприятий.`);
  console.log('Откройте на сайте:');
  console.log(`  • Главная:        http://localhost:3000`);
  console.log(`  • Календарь:      http://localhost:3000/events`);
  console.log(`  • Протокол:       http://localhost:3000/events/${finished1}`);
  console.log('    (места 1–6, затем DNF / DSQ / DNS / OTL без времени)');
}

main().catch((error) => {
  console.error('\n❌ Ошибка:', error instanceof Error ? error.message : error);
  process.exit(1);
});
