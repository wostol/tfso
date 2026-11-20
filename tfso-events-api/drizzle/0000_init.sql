CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'ongoing', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."result_status" AS ENUM('OK', 'DSQ', 'DNF', 'DNS', 'OTL');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_date" date NOT NULL,
	"location" text NOT NULL,
	"discipline" text,
	"status" "event_status" DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"athlete_name" text NOT NULL,
	"team" text,
	"birth_year" integer,
	"time_seconds" integer,
	"status" "result_status" DEFAULT 'OK' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "results_event_athlete_uq" ON "results" USING btree ("event_id","athlete_name");