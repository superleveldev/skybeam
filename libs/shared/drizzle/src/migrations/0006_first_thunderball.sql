DO $$ BEGIN
 CREATE TYPE "public"."frequency_period" AS ENUM('day', 'week');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."target_mode" AS ENUM('include', 'exclude');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "targeting_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"campaign_id" uuid NOT NULL,
	"budget" integer NOT NULL,
	"target_mode" "target_mode" DEFAULT 'include' NOT NULL,
	"frequency" integer DEFAULT 1 NOT NULL,
	"frequency_period" "frequency_period" DEFAULT 'day' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "targeting_groups" ADD CONSTRAINT "targeting_groups_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
