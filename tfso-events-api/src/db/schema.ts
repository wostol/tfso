import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "ongoing",
  "finished",
  "cancelled",
]);

export const resultStatusEnum = pgEnum("result_status", [
  "OK",
  "DSQ",
  "DNF",
  "DNS",
  "OTL",
]);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: date("event_date").notNull(),
  location: text("location").notNull(),
  discipline: text("discipline"),
  status: eventStatusEnum("status").notNull().default("upcoming"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const results = pgTable(
  "results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    athleteName: text("athlete_name").notNull(),
    team: text("team"),
    birthYear: integer("birth_year"),
    timeSeconds: integer("time_seconds"),
    status: resultStatusEnum("status").notNull().default("OK"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("results_event_athlete_uq").on(
      table.eventId,
      table.athleteName,
    ),
  ],
);
