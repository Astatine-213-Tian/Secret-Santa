CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"event_date" timestamp NOT NULL,
	"draw_date" timestamp NOT NULL,
	"location" text,
	"join_code" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_admin" boolean NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "participant_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "santa_pair" (
	"event_id" text NOT NULL,
	"giver_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	CONSTRAINT "santa_pair_event_id_giver_id_receiver_id_pk" PRIMARY KEY("event_id","giver_id","receiver_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profile" jsonb;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_pair" ADD CONSTRAINT "santa_pair_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_pair" ADD CONSTRAINT "santa_pair_giver_id_user_id_fk" FOREIGN KEY ("giver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "santa_pair" ADD CONSTRAINT "santa_pair_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "giver_id_idx" ON "santa_pair" USING btree ("giver_id");