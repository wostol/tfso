import { z } from "zod";

export const EVENT_STATUSES = [
  "upcoming",
  "ongoing",
  "finished",
  "cancelled",
] as const;
export const RESULT_STATUSES = ["OK", "DSQ", "DNF", "DNS", "OTL"] as const;

export const idParamSchema = z.object({
  id: z.string().uuid("Параметр id должен быть корректным UUID"),
});

/** Тело POST /api/events — создание мероприятия */
export const createEventSchema = z.object({
  title: z
    .string({ required_error: "Поле title обязательно" })
    .trim()
    .min(3, "Название должно содержать минимум 3 символа")
    .max(200, "Название не может быть длиннее 200 символов"),
  description: z
    .string()
    .max(5000, "Описание не может быть длиннее 5000 символов")
    .optional(),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата должна быть в формате YYYY-MM-DD"),
  location: z
    .string({ required_error: "Поле location обязательно" })
    .trim()
    .min(2, "Укажите место проведения (минимум 2 символа)")
    .max(200, "Место проведения не может быть длиннее 200 символов"),
  discipline: z.string().trim().max(100).optional(),
  status: z.enum(EVENT_STATUSES).default("upcoming"),
});

export const updateEventSchema = createEventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Не передано ни одного допустимого поля для обновления",
  });

/** Параметры GET /api/events — фильтры и пагинация */
export const listEventsQuerySchema = z.object({
  status: z.enum(EVENT_STATUSES).optional(),
  search: z.string().trim().max(100).optional(),
  limit: z.coerce
    .number()
    .int("limit должен быть целым числом")
    .min(1, "limit должен быть не меньше 1")
    .max(100, "limit не может быть больше 100")
    .default(20),
  offset: z.coerce
    .number()
    .int("offset должен быть целым числом")
    .min(0, "offset не может быть отрицательным")
    .default(0),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
