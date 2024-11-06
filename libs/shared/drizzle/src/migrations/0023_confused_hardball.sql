CREATE TABLE IF NOT EXISTS "options_deals" (
	"beeswax_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options_inventories" (
	"name" text NOT NULL,
	"list_name" text NOT NULL,
	"beeswax_list_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "geo_zip_codes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "inventories" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "targeting_expression_id" text;