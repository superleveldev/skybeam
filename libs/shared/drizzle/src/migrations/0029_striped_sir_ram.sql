DO $$ BEGIN
 CREATE TYPE "public"."level" AS ENUM('campaign', 'lineitem');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options_vendor_fees" (
	"name" text NOT NULL,
	"beeswax_id" integer NOT NULL,
	"level" "level" DEFAULT 'lineitem' NOT NULL,
	"environment" "environment" DEFAULT 'dev' NOT NULL
);
