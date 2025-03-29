ALTER TABLE "invitation" DROP COLUMN "id";
ALTER TABLE "assignment" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "assignment_exclusion" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "event_participant" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_giver_unique";--> statement-breakpoint
ALTER TABLE "invitation" DROP CONSTRAINT "invitation_token_unique";--> statement-breakpoint
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_secret_friend_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation" ADD PRIMARY KEY ("token");--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_event_id_giver_id_pk" PRIMARY KEY("event_id","giver_id");--> statement-breakpoint
ALTER TABLE "assignment_exclusion" ADD CONSTRAINT "assignment_exclusion_event_id_giver_id_forbidden_receiver_id_pk" PRIMARY KEY("event_id","giver_id","forbidden_receiver_id");--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_user_id_pk" PRIMARY KEY("event_id","user_id");--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "revoked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_event_id_normalized_email_unique" ON "invitation" USING btree ("event_id","normalized_email") WHERE "invitation"."revoked" = false;--> statement-breakpoint
ALTER TABLE "assignment" DROP COLUMN "secret_friend_id";--> statement-breakpoint