import { z } from "zod";
import { RESULT_STATUSES } from "../events/events.schemas";

export const eventIdParamSchema = z.object({
  eventId: z.string().uuid("Параметр eventId должен быть корректным UUID"),
});

const currentYear = new Date().getFullYear();

export const createResultSchema = z
  .object({
    athleteName: z
      .string({ required_error: "Поле athleteName обязательно" })
      .trim()
      .min(2, "Укажите фамилию и имя участника (минимум 2 символа)")
      .max(200, "Имя участника не может быть длиннее 200 символов"),
    team: z.string().trim().max(200).optional(),
    birthYear: z.coerce
      .number()
      .int("birthYear должен быть целым числом")
      .min(1930, "Слишком большой год рождения")
      .max(currentYear, `Год рождения не может быть больше ${currentYear}`)
      .optional(),
    timeSeconds: z.coerce
      .number()
      .int("timeSeconds должен быть целым числом (количество секунд)")
      .min(1, "Время должно быть положительным (в секундах)")
      .max(86400, "Время не может превышать 24 часов")
      .optional(),
    status: z.enum(RESULT_STATUSES).default("OK"),
  })
  .refine(
    (data) => data.status !== "OK" || typeof data.timeSeconds === "number",
    {
      message:
        "Для статуса OK обязательно поле timeSeconds (время прохождения дистанции, в секундах)",
    },
  )
  .refine((data) => data.status === "OK" || data.timeSeconds == null, {
    message: "Поле timeSeconds задаётся только для статуса OK",
  });

export type CreateResultInput = z.infer<typeof createResultSchema>;
