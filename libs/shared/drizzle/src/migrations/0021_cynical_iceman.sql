ALTER TABLE "targeting_groups" ADD COLUMN "geo_cities" jsonb DEFAULT '[]'::jsonb NOT NULL;