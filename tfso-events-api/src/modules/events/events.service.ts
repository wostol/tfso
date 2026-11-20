import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { Db } from "../../db/client";
import { events } from "../../db/schema";
import { AppError } from "../../errors";
import type {
  CreateEventInput,
  ListEventsQuery,
  UpdateEventInput,
} from "./events.schemas";

export async function getEventOr404(db: Db, id: string) {
  const [row] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  if (!row) {
    throw new AppError(404, `Мероприятие с id ${id} не найдено`);
  }
  return row;
}

export async function listEvents(db: Db, query: ListEventsQuery) {
  const filters = [];
  if (query.status) {
    filters.push(eq(events.status, query.status));
  }
  if (query.search) {
    filters.push(
      or(
        ilike(events.title, `%${query.search}%`),
        ilike(events.location, `%${query.search}%`),
      ),
    );
  }
  const where = filters.length > 0 ? and(...filters) : undefined;

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(events)
      .where(where)
      .orderBy(desc(events.eventDate), desc(events.createdAt))
      .limit(query.limit)
      .offset(query.offset),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(events)
      .where(where),
  ]);

  return {
    data: rows,
    meta: {
      total: totalRows[0]?.total ?? 0,
      limit: query.limit,
      offset: query.offset,
    },
  };
}

export async function createEvent(db: Db, input: CreateEventInput) {
  const [row] = await db
    .insert(events)
    .values({ ...input })
    .returning();
  return row;
}

export async function updateEvent(db: Db, id: string, input: UpdateEventInput) {
  await getEventOr404(db, id);

  const patch: Partial<typeof events.$inferInsert> = { updatedAt: new Date() };
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined)
    patch.description = input.description ?? null;
  if (input.eventDate !== undefined) patch.eventDate = input.eventDate;
  if (input.location !== undefined) patch.location = input.location;
  if (input.discipline !== undefined)
    patch.discipline = input.discipline ?? null;
  if (input.status !== undefined) patch.status = input.status;

  const [row] = await db
    .update(events)
    .set(patch)
    .where(eq(events.id, id))
    .returning();
  return row;
}

export async function deleteEvent(db: Db, id: string) {
  const [row] = await db
    .delete(events)
    .where(eq(events.id, id))
    .returning({ id: events.id });
  if (!row) {
    throw new AppError(404, `Мероприятие с id ${id} не найдено`);
  }
  return row;
}
