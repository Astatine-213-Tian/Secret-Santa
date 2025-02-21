CREATE TABLE "event_join_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_valid" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_participant" (
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_participant_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "participant" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "participant" CASCADE;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "budget" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "organizer_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "event_join_code" ADD CONSTRAINT "event_join_code_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_event_join_codes_valid" ON "event_join_code" USING btree ("code","is_valid");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_valid_codes" ON "event_join_code" USING btree ("code") WHERE "event_join_code"."is_valid" = true;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "join_code";