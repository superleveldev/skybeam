CREATE TABLE IF NOT EXISTS "targeting_group_creatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"creative_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "targeting_group_creatives" ADD CONSTRAINT "targeting_group_creatives_campaign_id_targeting_groups_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."targeting_groups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "targeting_group_creatives" ADD CONSTRAINT "targeting_group_creatives_creative_id_creatives_id_fk" FOREIGN KEY ("creative_id") REFERENCES "public"."creatives"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "advertisers" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "creatives" ADD COLUMN "preview_url" text;--> statement-breakpoint
ALTER TABLE "creatives" ADD COLUMN "duration_ms" integer;--> statement-breakpoint
ALTER TABLE "creatives" ADD COLUMN "resolution_width" integer;--> statement-breakpoint
ALTER TABLE "creatives" ADD COLUMN "resolution_height" integer;--> statement-breakpoint