DO $$ BEGIN
 CREATE TYPE "public"."deletion_object_type" AS ENUM('campaign', 'advertiser', 'creative', 'targeting_group', 'user', 'organization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deletions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object_type" "deletion_object_type" NOT NULL,
	"object_id" text NOT NULL,
	"deleted_by" varchar(256) NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "deletion_table_object_id" UNIQUE("object_type","object_id")
);
