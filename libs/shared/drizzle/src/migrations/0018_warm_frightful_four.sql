ALTER TABLE "campaigns" ADD COLUMN "frequency" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "frequency_period" "frequency_period" DEFAULT 'day' NOT NULL;--> statement-breakpoint
ALTER TABLE "targeting_groups" DROP COLUMN IF EXISTS "frequency";--> statement-breakpoint
ALTER TABLE "targeting_groups" DROP COLUMN IF EXISTS "frequency_period";