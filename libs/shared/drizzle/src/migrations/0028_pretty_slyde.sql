ALTER TYPE "http_method" ADD VALUE 'GET';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_targetingexpressions" (
	"id" uuid NOT NULL,
	"request_body" jsonb NOT NULL,
	"response_body" jsonb NOT NULL,
	"status_code" integer NOT NULL,
	"http_method" "http_method" NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"operation_time" timestamp with time zone DEFAULT now() NOT NULL,
	"dsp" "dsp" NOT NULL
);
