DO $$ BEGIN
 CREATE TYPE "public"."industry" AS ENUM('Arts & Entertainment', 'Automotive', 'Business', 'Careers', 'Education', 'Family & Parenting', 'Health & Fitness', 'Food & Drink', 'Hobbies & Interests', 'Home & Garden', 'Law, Government, & Politics', 'News / Weather / Information 3', 'Personal Finance', 'Society', 'Science', 'Pets', 'Sports', 'Style & Fashion', 'Technology & Computing', 'Travel', 'Real Estate', 'Shopping', 'Religion & Spirituality', 'Uncategorized', 'Non-Standard Content', 'Illegal Content');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "advertisers" ADD COLUMN "industry" "industry" DEFAULT 'Uncategorized' NOT NULL;