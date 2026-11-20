import type { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Db } from '../../db/client';
import { parseOrThrow } from '../../errors';
import { createResultSchema, eventIdParamSchema } from './results.schemas';
import * as service from './results.service';

export async function resultsRoutes(app: FastifyInstance, opts: { db: Db }): Promise<void> {
  const { db } = opts;

  // GET /api/events/:eventId/results
  app.get(
    '/api/events/:eventId/results',
    {
      schema: {
        tags: ['Results'],
        summary: 'Результаты мероприятия',
        description:
          'Возвращает результаты с распределением мест: сначала финишировавшие (OK) по возрастанию времени, затем сошедшие/снятые/не стартовавшие (place = null).',
        params: zodToJsonSchema(eventIdParamSchema),
      },
    },
    async (request) => {
      const { eventId } = parseOrThrow(
        eventIdParamSchema,
        request.params,
        'Некорректный идентификатор мероприятия',
      );
      return service.listResults(db, eventId);
    },
  );

  // POST /api/events/:eventId/results
  app.post(
    '/api/events/:eventId/results',
    {
      schema: {
        tags: ['Results'],
        summary: 'Добавить результат участника',
        body: zodToJsonSchema(createResultSchema),
      },
    },
    async (request, reply) => {
      const { eventId } = parseOrThrow(
        eventIdParamSchema,
        request.params,
        'Некорректный идентификатор мероприятия',
      );
      const body = parseOrThrow(createResultSchema, request.body, 'Некорректное тело запроса');
      const created = await service.createResult(db, eventId, body);
      reply.code(201);
      return created;
    },
  );
}
