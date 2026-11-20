import { buildApp } from "./app";
import { loadConfig } from "./config";
import { createDb } from "./db/client";
import { runMigrations } from "./db/migrate";

async function main(): Promise<void> {
  const config = loadConfig();
  const { db, pool } = createDb(config.DATABASE_URL);

  await runMigrations(db);

  const app = await buildApp(db, config);
  await app.listen({ port: config.PORT, host: "0.0.0.0" });

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "Получен сигнал завершения, останавливаемся");
    await app.close();
    await pool.end();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((error) => {
  console.error(
    "Не удалось запустить микросервис:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
