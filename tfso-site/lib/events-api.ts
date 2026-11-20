/**
 * Тонкий типизированный клиент к микросервису «Мероприятия и результаты».
 *
 * Это ЕДИНСТВЕННОЕ место в сайте, которое знает URL микросервиса.
 * Все компоненты и страницы работают только с функциями из этого файла —
 * поэтому, если микросервис переедет на другой адрес, меняется одна переменная
 * окружения EVENTS_API_URL, а не десяток вызовов fetch по всему коду.
 *
 * Маршруты (контракт описан в README микросервиса):
 *   GET    /api/events                       — список с фильтрами
 *   GET    /api/events/:id                   — одно мероприятие
 *   GET    /api/events/:eventId/results      — протокол с распределением мест
 *
 * Все запросы выполняются на сервере Next.js (Server Components), а не в браузере,
 * поэтому CORS не нужен: это сервер-серверный вызов внутри Docker-сети.
 */

/** Жизненный цикл мероприятия (как в микросервисе) */
export type EventStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';

/** Статус результата участника — как в протоколах SportOrg */
export type ResultStatus = 'OK' | 'DSQ' | 'DNF' | 'DNS' | 'OTL';

/** Мероприятие — форма ответа микросервиса (GET /api/events/...) */
export type ApiEvent = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // YYYY-MM-DD
  location: string;
  discipline: string | null;
  status: EventStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/** Результат участника — форма ответа GET /api/events/:id/results */
export type ApiResult = {
  id: string;
  eventId: string;
  athleteName: string;
  team: string | null;
  birthYear: number | null;
  timeSeconds: number | null;
  status: ResultStatus;
  createdAt: string;
  timeFormatted: string | null; // ЧЧ:ММ:СС, null для DNF/DNS/DSQ/OTL
  place: number | null; // 1 для победителя, null для сошедших
};

/** Обёртка списка с пагинацией */
export type ApiList<T> = {
  data: T[];
  meta: { total: number; limit: number; offset: number };
};

/** Обёртка протокола результатов */
export type ApiResultsList = {
  data: ApiResult[];
  meta: { total: number; finished: number };
};

/** Параметры фильтра списка мероприятий */
export type ListEventsParams = {
  status?: EventStatus;
  search?: string;
  limit?: number;
  offset?: number;
};

const EVENTS_API_URL =
  process.env.EVENTS_API_URL ?? 'http://localhost:4000';

/** Универсальный обработчик ответа: бросает с понятным сообщением, если не 2xx */
async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Тело ошибки от микросервиса имеет вид { error: string, details?: unknown }
    let detail = '';
    try {
      const body = (await res.json()) as { error?: string };
      detail = body?.error ?? '';
    } catch {
      /* не JSON — игнорируем */
    }
    throw new EventsApiError(res.status, detail || res.statusText);
  }
  return (await res.json()) as T;
}

/** Ошибка вызова микросервиса. Страницы сайта ловят её через error.tsx. */
export class EventsApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(`Events API ${statusCode}: ${message}`);
    this.name = 'EventsApiError';
  }
}

function withQuery(params: ListEventsParams): string {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

/** GET /api/events — список мероприятий с фильтрами и пагинацией */
export async function getEvents(params: ListEventsParams = {}): Promise<ApiList<ApiEvent>> {
  const res = await fetch(`${EVENTS_API_URL}/api/events${withQuery(params)}`, {
    // Календарь всегда должен быть свежим: не кэшируем на сервере Next.js
    cache: 'no-store',
  });
  return parseResponse<ApiList<ApiEvent>>(res);
}

/** GET /api/events/:id — одно мероприятие */
export async function getEvent(id: string): Promise<ApiEvent> {
  const res = await fetch(`${EVENTS_API_URL}/api/events/${id}`, {
    cache: 'no-store',
  });
  return parseResponse<ApiEvent>(res);
}

/** GET /api/events/:eventId/results — протокол с распределением мест */
export async function getResults(eventId: string): Promise<ApiResultsList> {
  const res = await fetch(`${EVENTS_API_URL}/api/events/${eventId}/results`, {
    cache: 'no-store',
  });
  return parseResponse<ApiResultsList>(res);
}

/** GET /health — проверка работоспособности микросервиса */
export async function getHealth(): Promise<{ status: string; timestamp: string }> {
  const res = await fetch(`${EVENTS_API_URL}/health`, { cache: 'no-store' });
  return parseResponse<{ status: string; timestamp: string }>(res);
}
