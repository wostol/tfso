import Fastify, { type FastifyInstance } from "fastify";
import type { AppConfig } from "./config";
import type { Db } from "./db/client";
import { eventsRoutes } from "./modules/events/events.routes";
import { resultsRoutes } from "./modules/results/results.routes";
import { registerErrorHandler } from "./plugins/error-handler";
import { registerSwagger } from "./plugins/swagger";

export async function buildApp(
  db: Db,
  config: AppConfig,
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { translateTime: "HH:MM:ss" } }
          : undefined,
    },
  });

  registerErrorHandler(app);
  await registerSwagger(app);

  await app.register(eventsRoutes, { prefix: "/api/events", db });
  await app.register(resultsRoutes, { db });

  app.get(
    "/health",
    { schema: { tags: ["System"], summary: "Проверка работоспособности" } },
    async () => ({ status: "ok", timestamp: new Date().toISOString() }),
  );

  return app;
}
