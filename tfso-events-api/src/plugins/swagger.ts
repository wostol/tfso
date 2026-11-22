import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "TFSO Events API",
        description:
          "Учебный REST-микросервис «Мероприятия и результаты» федерации спортивного ориентирования (ТФСО). " +
          "CRUD мероприятий, результаты участников со статусами протокола SportOrg (OK/DSQ/DNF/DNS/OTL), " +
          "валидация запросов (Zod), обработка ошибок, PostgreSQL + Drizzle ORM.",
        version: "1.0.0",
      },
      servers: [{ url: "/" }],
      tags: [
        { name: "Events", description: "Мероприятия" },
        { name: "Results", description: "Результаты участников" },
        { name: "System", description: "Служебные методы" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "none" },
  });
}
