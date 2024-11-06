ALTER TABLE "targeting_group_creatives" RENAME COLUMN "campaign_id" TO "targeting_group_id";--> statement-breakpoint
ALTER TABLE "targeting_group_creatives" RENAME CONSTRAINT "targeting_group_creatives_campaign_id_targeting_groups_id_fk" TO "targeting_group_creatives_targeting_group_id_targeting_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "fee" double precision DEFAULT 0.4 NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "alt_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "campaigns_alt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "advertisers" ADD COLUMN "alt_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "advertisers_alt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "targeting_groups" ADD COLUMN "alt_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "targeting_groups_alt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint