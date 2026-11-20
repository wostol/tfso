import { defineConfig } from 'drizzle-kit';

// Конфигурация генератора миграций Drizzle Kit.
// `generate` работает офлайн: читает схему и выдаёт SQL-файлы в папку drizzle/.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://tfso:tfso@localhost:5432/tfso_events',
  },
});
