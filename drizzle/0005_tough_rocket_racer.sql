ALTER TABLE "santa_pair" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "santa_pair" CASCADE;--> statement-breakpoint
ALTER TABLE "event_participant" ADD COLUMN "secret_friend_id" text;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_secret_friend_id_user_id_fk" FOREIGN KEY ("secret_friend_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;