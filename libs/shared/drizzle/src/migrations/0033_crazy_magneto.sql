ALTER TABLE "advertisers" ALTER industry TYPE TEXT;--> statement-breakpoint
UPDATE "advertisers"
SET industry='Law, Government & Politics'
WHERE industry='Law, Government, & Politics';--> statement-breakpoint
DROP TYPE "industry" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."industry" AS ENUM('Arts & Entertainment', 'Automotive', 'Business', 'Careers', 'Education', 'Family & Parenting', 'Health & Fitness', 'Food & Drink', 'Hobbies & Interests', 'Home & Garden', 'Law, Government & Politics', 'News, Weather & Information', 'Personal Finance', 'Society', 'Science', 'Pets', 'Sports', 'Style & Fashion', 'Technology & Computing', 'Travel', 'Real Estate', 'Shopping', 'Religion & Spirituality', 'Uncategorized', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "advertisers" ALTER industry TYPE "industry" USING industry::industry;--> statement-breakpoint
ALTER TABLE "advertisers" ALTER industry SET DEFAULT 'Uncategorized'::industry;
