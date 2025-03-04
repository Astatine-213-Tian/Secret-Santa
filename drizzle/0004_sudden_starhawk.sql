ALTER TABLE "event_join_code" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "event_join_code" CASCADE;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "join_code" varchar(9);--> statement-breakpoint 
-- assign a default value to the join_code column
UPDATE "event" SET "join_code" = FLOOR(RANDOM() * (999999999 - 100000000 + 1) + 100000000)::varchar;
-- set the join_code column to be non null
ALTER TABLE "event" ALTER COLUMN "join_code" SET NOT NULL;
-- set the join_code column to be unique
ALTER TABLE "event" ADD CONSTRAINT "event_join_code_unique" UNIQUE("join_code");