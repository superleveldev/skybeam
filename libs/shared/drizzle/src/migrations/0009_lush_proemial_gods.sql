ALTER TABLE "advertisers" DROP CONSTRAINT "name";--> statement-breakpoint
ALTER TABLE "advertisers" ADD CONSTRAINT "advertiser_name" UNIQUE("clerk_organization_id","name");--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaign_name" UNIQUE("advertiser_id","name");