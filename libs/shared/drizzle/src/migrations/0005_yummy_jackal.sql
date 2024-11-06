CREATE TABLE IF NOT EXISTS "email_messages" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"body" text,
	"body_plain" text,
	"app_domain_name" text,
	"app_logo_image_url" text,
	"app_logo_url" text,
	"app_name" text,
	"app_url" text,
	"otp_code" varchar(256),
	"requested_at" timestamp with time zone,
	"requested_by" varchar(256),
	"theme_button_text_color" varchar(10),
	"theme_primary_color" varchar(10),
	"theme_show_clerk_branding" boolean,
	"delivered_by_clerk" boolean,
	"email_address_id" varchar(256),
	"from_email_name" varchar(256),
	"slug" varchar(256),
	"source" varchar(256),
	"status" varchar(256),
	"subject" text,
	"to_email_address" varchar(256),
	"user_id" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_domains" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"affiliation_email_address" varchar(256),
	"enrollment_mode" varchar(256),
	"name" varchar(256),
	"organization_id" varchar(256),
	"total_pending_invitations" integer,
	"total_pending_suggestions" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"verification_attempts" integer,
	"verification_expire_at" timestamp with time zone,
	"verification_status" varchar(256),
	"verification_strategy" varchar(256),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_invitations" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"email_address" varchar(256),
	"organization_id" varchar(256),
	"role" varchar(256),
	"status" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_memberships" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"organization_created_by" varchar(256),
	"organization_id" varchar(256),
	"organization_image_url" text,
	"organization_logo_url" text,
	"organization_name" varchar(256),
	"organization_slug" varchar(256),
	"organization_created_at" timestamp,
	"organization_updated_at" timestamp,
	"public_user_data_first_name" varchar(256),
	"public_user_data_identifier" varchar(256),
	"public_user_data_image_url" text,
	"public_user_data_last_name" varchar(256),
	"public_user_data_profile_image_url" text,
	"public_user_data_user_id" varchar(256),
	"role" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"created_by" varchar(256),
	"image_url" text,
	"logo_url" text,
	"manual_plan_level" varchar(256),
	"name" varchar(256),
	"slug" varchar(256),
	"stripe_customer_id" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"last_active_at" timestamp with time zone,
	"last_integrations_refresh_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"description" text,
	"key" varchar(256),
	"name" varchar(256),
	"type" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"description" text,
	"is_creator_eligible" boolean,
	"key" varchar(256),
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"client_id" varchar(256),
	"status" varchar(256),
	"user_id" varchar(256),
	"last_active_at" timestamp with time zone,
	"expire_at" timestamp with time zone,
	"abandon_at" timestamp with time zone,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sms_messages" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"app_domain_name" varchar(256),
	"app_logo_image_url" text,
	"app_logo_url" text,
	"app_name" varchar(256),
	"app_url" text,
	"otp_code" varchar(256),
	"delivered_by_clerk" boolean,
	"from_phone_number" varchar(256),
	"message" text,
	"phone_number_id" varchar(256),
	"slug" varchar(256),
	"status" varchar(256),
	"to_phone_number" varchar(256),
	"user_id" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"backup_code_enabled" boolean,
	"banned" boolean,
	"create_organization_enabled" boolean,
	"delete_self_enabled" boolean,
	"email_addresses" jsonb,
	"external_accounts" jsonb,
	"external_id" varchar(256),
	"first_name" varchar(256),
	"has_image" boolean,
	"image_url" text,
	"last_name" varchar(256),
	"locked" boolean,
	"lockout_expires_in_seconds" bigint,
	"passkeys" jsonb,
	"password_enabled" boolean,
	"phone_numbers" jsonb,
	"primary_email_address_id" varchar(256),
	"primary_phone_number_id" varchar(256),
	"primary_web3_wallet_id" varchar(256),
	"private_metadata" jsonb,
	"profile_image_url" text,
	"public_metadata" jsonb,
	"saml_accounts" jsonb,
	"totp_enabled" boolean,
	"two_factor_enabled" boolean,
	"unsafe_metadata" jsonb,
	"username" varchar(256),
	"verification_attempts_remaining" integer,
	"web3_wallets" jsonb,
	"vendor_identity_map" jsonb,
	"last_active_at" timestamp,
	"last_sign_in_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_domains" ADD CONSTRAINT "organization_domains_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_public_user_data_user_id_users_id_fk" FOREIGN KEY ("public_user_data_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sms_messages" ADD CONSTRAINT "sms_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
