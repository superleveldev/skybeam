DROP INDEX IF EXISTS "org_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_idx" ON "advertisers" USING btree ("clerk_organization_id");