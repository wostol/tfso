import { and, asc, eq } from "drizzle-orm";
import type { Db } from "../../db/client";
import { results } from "../../db/schema";
import { AppError } from "../../errors";
import { getEventOr404 } from "../events/events.service";
import type { CreateResultInput } from "./results.schemas";

export function formatTime(seconds: number | null): string | null {
  if (seconds == null) {
    return null;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export async function listResults(db: Db, eventId: string) {
  // 404, если мероприятия не существует
  await getEventOr404(db, eventId);

  const rows = await db
    .select()
    .from(results)
    .where(eq(results.eventId, eventId))
    .orderBy(asc(results.timeSeconds), asc(results.createdAt));

  const finished = rows.filter(
    (r) => r.status === "OK" && r.timeSeconds != null,
  );
  const others = rows.filter(
    (r) => !(r.status === "OK" && r.timeSeconds != null),
  );

  const data = [
    ...finished.map((r, index) => ({
      ...r,
      timeFormatted: formatTime(r.timeSeconds),
      place: index + 1,
    })),
    ...others.map((r) => ({
      ...r,
      timeFormatted: formatTime(r.timeSeconds),
      place: null,
    })),
  ];

  return { data, meta: { total: rows.length, finished: finished.length } };
}

export async function createResult(
  db: Db,
  eventId: string,
  input: CreateResultInput,
) {
  await getEventOr404(db, eventId);

  const [duplicate] = await db
    .select({ id: results.id })
    .from(results)
    .where(
      and(
        eq(results.eventId, eventId),
        eq(results.athleteName, input.athleteName),
      ),
    )
    .limit(1);
  if (duplicate) {
    throw new AppError(
      409,
      `Результат участника «${input.athleteName}» уже добавлен на это мероприятие`,
    );
  }

  const [row] = await db
    .insert(results)
    .values({
      eventId,
      athleteName: input.athleteName,
      team: input.team ?? null,
      birthYear: input.birthYear ?? null,
      timeSeconds: input.status === "OK" ? (input.timeSeconds as number) : null,
      status: input.status,
    })
    .returning();

  return { ...row, timeFormatted: formatTime(row.timeSeconds), place: null };
}
