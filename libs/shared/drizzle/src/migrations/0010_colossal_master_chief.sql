DO $$ BEGIN
 CREATE TYPE "public"."beeswax_sync" AS ENUM('success', 'pending', 'failure');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."metric_status" AS ENUM('inactive', 'pending', 'connected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"status" "metric_status" DEFAULT 'inactive' NOT NULL,
	"external_id" text NOT NULL,
	"advertiser_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "metric_id" uuid;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "external_id" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "beeswax_sync" "beeswax_sync";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metrics" ADD CONSTRAINT "metrics_advertiser_id_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertisers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_metric_id_metrics_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
