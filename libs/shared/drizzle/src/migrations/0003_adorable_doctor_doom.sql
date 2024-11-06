DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "timezone" text DEFAULT 'Etc/GMT' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "status" "status" DEFAULT 'draft' NOT NULL;