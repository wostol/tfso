import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Db } from "./client";

export async function runMigrations(
  db: Db,
  migrationsFolder = "drizzle",
): Promise<void> {
  await migrate(db, { migrationsFolder });
}
