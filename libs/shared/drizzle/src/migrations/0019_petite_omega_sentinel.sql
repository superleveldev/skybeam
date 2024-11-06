ALTER TABLE "targeting_groups" ADD COLUMN "age" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "categories" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "gender" jsonb DEFAULT '[]'::jsonb NOT NULL;