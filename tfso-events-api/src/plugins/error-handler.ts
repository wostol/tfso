import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../errors";

/** Код ошибки PostgreSQL «нарушение ограничения уникальности» */
const PG_UNIQUE_VIOLATION = "23505";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setValidatorCompiler(() => () => true);

  // Неизвестный маршрут — тоже аккуратный JSON, а не HTML-страница Fastify
  app.setNotFoundHandler((request, reply) => {
    reply
      .code(404)
      .send({ error: `Маршрут ${request.method} ${request.url} не найден` });
  });

  app.setErrorHandler((error, request, reply) => {
    // 1. Ошибки приложения: валидация, 404, 409 и т.п.
    if (error instanceof AppError) {
      request.log.warn(
        { err: error, path: request.url },
        "Ошибка обработки запроса",
      );
      return reply
        .code(error.statusCode)
        .send({ error: error.message, details: error.details });
    }

    // 2. Прямые ошибки Zod (страховочный сценарий)
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: "Некорректные данные запроса",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 3. Ошибки ограничений PostgreSQL
    const pgCode = (error as { code?: string }).code;
    if (pgCode === PG_UNIQUE_VIOLATION) {
      return reply
        .code(409)
        .send({ error: "Запись с такими данными уже существует" });
    }

    // 4. Ошибки фреймворка с HTTP-кодом < 500 (например, некорректный JSON в теле запроса)
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (typeof statusCode === "number" && statusCode < 500) {
      const message = error instanceof Error ? error.message : "Ошибка запроса";
      return reply.code(statusCode).send({ error: message });
    }

    // 5. Всё остальное — логируем полностью, клиенту отдаём безопасное сообщение
    request.log.error(
      { err: error, path: request.url },
      "Внутренняя ошибка сервера",
    );
    return reply.code(500).send({ error: "Внутренняя ошибка сервера" });
  });
}
