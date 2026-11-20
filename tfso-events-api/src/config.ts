import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string({ required_error: "DATABASE_URL не задан" })
    .min(1, "DATABASE_URL не задан")
    .refine(
      (v) => v.startsWith("postgres://") || v.startsWith("postgresql://"),
      {
        message: "DATABASE_URL должен начинаться с postgres://",
      },
    ),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(): AppConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Некорректные переменные окружения:\n${messages}`);
  }
  return result.data;
}
