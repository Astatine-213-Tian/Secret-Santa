CREATE TABLE "assignment" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"giver_id" varchar(11) NOT NULL,
	"receiver_id" varchar(11) NOT NULL,
	"secret_friend_id" varchar(11),
	CONSTRAINT "assignment_giver_unique" UNIQUE("event_id","giver_id"),
	CONSTRAINT "assignment_receiver_unique" UNIQUE("event_id","receiver_id")
);
--> statement-breakpoint
CREATE TABLE "assignment_exclusion" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"giver_id" varchar(11) NOT NULL,
	"forbidden_receiver_id" varchar(11) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"email" text NOT NULL,
	"normalized_email" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '24 hours' NOT NULL,
	CONSTRAINT "invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_join_code_unique";--> statement-breakpoint
ALTER TABLE "event_participant" DROP CONSTRAINT "event_participant_secret_friend_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "event_participant" DROP CONSTRAINT "event_participant_event_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "normalized_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "draw_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_giver_id_user_id_fk" FOREIGN KEY ("giver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_secret_friend_id_user_id_fk" FOREIGN KEY ("secret_friend_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_exclusion" ADD CONSTRAINT "assignment_exclusion_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_exclusion" ADD CONSTRAINT "assignment_exclusion_giver_id_user_id_fk" FOREIGN KEY ("giver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_exclusion" ADD CONSTRAINT "assignment_exclusion_forbidden_receiver_id_user_id_fk" FOREIGN KEY ("forbidden_receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "draw_date";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "join_code";--> statement-breakpoint
ALTER TABLE "event_participant" DROP COLUMN "secret_friend_id";