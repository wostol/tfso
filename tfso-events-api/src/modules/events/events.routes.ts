import type { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Db } from '../../db/client';
import { parseOrThrow } from '../../errors';
import {
  createEventSchema,
  idParamSchema,
  listEventsQuerySchema,
  updateEventSchema,
} from './events.schemas';
import * as service from './events.service';

export async function eventsRoutes(app: FastifyInstance, opts: { db: Db }): Promise<void> {
  const { db } = opts;

  // GET /api/events
  app.get(
    '/',
    {
      schema: {
        tags: ['Events'],
        summary: 'Список мероприятий',
        description:
          'Постраничный список мероприятий. Фильтр по статусу (status), поиск по названию и месту проведения (search), пагинация (limit/offset).',
        querystring: zodToJsonSchema(listEventsQuerySchema),
      },
    },
    async (request) => {
      const query = parseOrThrow(listEventsQuerySchema, request.query, 'Некорректные параметры запроса');
      return service.listEvents(db, query);
    },
  );

  // GET /api/events/:id
  app.get(
    '/:id',
    {
      schema: {
        tags: ['Events'],
        summary: 'Получить мероприятие по идентификатору',
        params: zodToJsonSchema(idParamSchema),
      },
    },
    async (request) => {
      const { id } = parseOrThrow(idParamSchema, request.params, 'Некорректный идентификатор');
      return service.getEventOr404(db, id);
    },
  );

  // POST /api/events
  app.post(
    '/',
    {
      schema: {
        tags: ['Events'],
        summary: 'Создать мероприятие',
        body: zodToJsonSchema(createEventSchema),
      },
    },
    async (request, reply) => {
      const body = parseOrThrow(createEventSchema, request.body, 'Некорректное тело запроса');
      const created = await service.createEvent(db, body);
      reply.code(201);
      return created;
    },
  );

  // PATCH /api/events/:id
  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Events'],
        summary: 'Частично обновить мероприятие',
        params: zodToJsonSchema(idParamSchema),
        body: zodToJsonSchema(updateEventSchema),
      },
    },
    async (request) => {
      const { id } = parseOrThrow(idParamSchema, request.params, 'Некорректный идентификатор');
      const body = parseOrThrow(updateEventSchema, request.body, 'Некорректное тело запроса');
      return service.updateEvent(db, id, body);
    },
  );

  // DELETE /api/events/:id
  app.delete(
    '/:id',
    {
      schema: {
        tags: ['Events'],
        summary: 'Удалить мероприятие',
        description: 'Удаляет мероприятие вместе со всеми его результатами (каскадное удаление на уровне СУБД).',
        params: zodToJsonSchema(idParamSchema),
      },
    },
    async (request, reply) => {
      const { id } = parseOrThrow(idParamSchema, request.params, 'Некорректный идентификатор');
      await service.deleteEvent(db, id);
      return reply.code(204).send();
    },
  );
}
