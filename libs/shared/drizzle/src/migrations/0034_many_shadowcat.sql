DO $$ BEGIN
 CREATE TYPE "public"."envEnum" AS ENUM('production', 'development');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advertiser_pixels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pixel_id" uuid NOT NULL,
	"advertiser_id" uuid,
	"name" text,
	"environment" "envEnum" DEFAULT 'production',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertiser_pixels" ADD CONSTRAINT "advertiser_pixels_advertiser_id_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertisers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
