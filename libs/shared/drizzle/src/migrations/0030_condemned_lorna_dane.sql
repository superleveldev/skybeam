DELETE FROM "options_deals";--> statement-breakpoint
ALTER TABLE "options_deals" ADD COLUMN "floor" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "options_deals" ADD COLUMN "multiplier" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "options_deals" ADD CONSTRAINT "options_deals_pkey" PRIMARY KEY("environment","beeswax_id");--> statement-breakpoint
ALTER TABLE "options_inventories" ADD CONSTRAINT "options_inventories_pkey" PRIMARY KEY("environment","beeswax_list_id","name","list_name");--> statement-breakpoint
ALTER TABLE "options_vendor_fees" ADD CONSTRAINT "options_vendors_pkey" PRIMARY KEY("environment","beeswax_id","level","name");--> statement-breakpoint
