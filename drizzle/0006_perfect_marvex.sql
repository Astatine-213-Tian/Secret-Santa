ALTER TABLE "account" ALTER COLUMN "id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "user_id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "organizer_id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "event_participant" ALTER COLUMN "user_id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "event_participant" ALTER COLUMN "secret_friend_id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "id" SET DATA TYPE varchar(11);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "normalized_email" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_normalized_email_unique" UNIQUE("normalized_email");