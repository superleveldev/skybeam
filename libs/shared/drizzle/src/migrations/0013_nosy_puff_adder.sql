DO $$ BEGIN
 CREATE TYPE "public"."dsp" AS ENUM('beeswax', 'bidder');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."http_method" AS ENUM('POST', 'PUT', 'DELETE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_advertisers" (
	"id" uuid NOT NULL,
	"request_body" jsonb NOT NULL,
	"response_body" jsonb NOT NULL,
	"http_method" "http_method" NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"operation_time" timestamp with time zone DEFAULT now() NOT NULL,
	"dsp" "dsp" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_campaigns" (
	"id" uuid NOT NULL,
	"request_body" jsonb NOT NULL,
	"response_body" jsonb NOT NULL,
	"http_method" "http_method" NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"operation_time" timestamp with time zone DEFAULT now() NOT NULL,
	"dsp" "dsp" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_lineitems" (
	"id" uuid NOT NULL,
	"request_body" jsonb NOT NULL,
	"response_body" jsonb NOT NULL,
	"http_method" "http_method" NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"operation_time" timestamp with time zone DEFAULT now() NOT NULL,
	"dsp" "dsp" NOT NULL
);
