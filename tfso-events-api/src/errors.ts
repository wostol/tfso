import type { ZodTypeAny, output } from "zod";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function parseOrThrow<S extends ZodTypeAny>(
  schema: S,
  data: unknown,
  message = "Некорректные данные запроса",
): output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(
      400,
      message,
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }
  return result.data;
}
