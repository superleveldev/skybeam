CREATE TABLE IF NOT EXISTS "audit_bidmodifiers" (
	"id" uuid NOT NULL,
	"request_body" jsonb NOT NULL,
	"response_body" jsonb NOT NULL,
	"status_code" integer NOT NULL,
	"http_method" "http_method" NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"operation_time" timestamp with time zone DEFAULT now() NOT NULL,
	"dsp" "dsp" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "bid_modifier_id" text;