CREATE TABLE IF NOT EXISTS "creatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advertiser_id" uuid NOT NULL,
	"name" text NOT NULL,
	"file_path" text,
	"transcoded_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "creatives_name_key" UNIQUE("advertiser_id","name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creatives" ADD CONSTRAINT "creatives_advertiser_id_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertisers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
