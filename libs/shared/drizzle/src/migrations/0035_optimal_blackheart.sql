ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_metric_id_metrics_id_fk";
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "pixel_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_pixel_id_advertiser_pixels_id_fk" FOREIGN KEY ("pixel_id") REFERENCES "public"."advertiser_pixels"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN IF EXISTS "metric_id";