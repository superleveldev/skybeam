DO $$ BEGIN
 CREATE TYPE "public"."environment" AS ENUM('dev', 'prod');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "options_deals" ADD COLUMN "environment" "environment" DEFAULT 'dev' NOT NULL;--> statement-breakpoint
ALTER TABLE "options_inventories" ADD COLUMN "environment" "environment" DEFAULT 'dev' NOT NULL;