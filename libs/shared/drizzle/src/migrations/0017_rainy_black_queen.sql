ALTER TABLE "audit_advertisers" ADD COLUMN "status_code" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_campaigns" ADD COLUMN "status_code" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_lineitems" ADD COLUMN "status_code" integer NOT NULL;