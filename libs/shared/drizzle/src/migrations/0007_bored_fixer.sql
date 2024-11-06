CREATE TABLE IF NOT EXISTS "stripe_charges" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"amount" integer,
	"amount_captured" integer,
	"amount_refunded" integer,
	"application" varchar(256),
	"application_fee" varchar(256),
	"application_fee_amount" integer,
	"authorization_code" varchar(256),
	"balance_transaction" varchar(256),
	"billing_details" jsonb,
	"calculated_statement_descriptor" text,
	"captured" boolean,
	"currency" varchar(256),
	"customer" varchar(256),
	"description" text,
	"disputed" boolean,
	"failure_balance_transaction" varchar(256),
	"failure_code" varchar(256),
	"failure_message" text,
	"fraud_details" jsonb,
	"invoice" varchar(256),
	"level3" jsonb,
	"livemode" boolean,
	"metadata" jsonb,
	"on_behalf_of" varchar(256),
	"outcome" jsonb,
	"paid" boolean,
	"payment_intent" varchar(256),
	"payment_method" varchar(256),
	"payment_method_details" jsonb,
	"radar_options" jsonb,
	"receipt_email" varchar(256),
	"receipt_number" varchar(256),
	"receipt_url" text,
	"refunded" boolean,
	"refunds" jsonb,
	"review" varchar(256),
	"shipping" jsonb,
	"source_transfer" varchar(256),
	"statement_descriptor" varchar(256),
	"statement_descriptor_suffix" varchar(256),
	"status" varchar(256),
	"transfer" varchar(256),
	"transfer_data" jsonb,
	"transfer_group" varchar(256),
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_checkout_sessions" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"after_expiration" jsonb,
	"allow_promotion_codes" boolean,
	"amount_subtotal" integer,
	"amount_total" integer,
	"automatic_tax" jsonb,
	"billing_address_collection" varchar(256),
	"cancel_url" text,
	"client_reference_id" varchar(256),
	"client_secret" text,
	"consent" jsonb,
	"consent_collection" jsonb,
	"currency" varchar(256),
	"currency_conversion" jsonb,
	"custom_fields" jsonb,
	"custom_text" jsonb,
	"customer" varchar(256),
	"customer_creation" varchar(256),
	"customer_details" jsonb,
	"customer_email" varchar(256),
	"invoice" varchar(256),
	"invoice_creation" jsonb,
	"line_items" jsonb,
	"livemode" boolean,
	"locale" varchar(256),
	"metadata" jsonb,
	"mode" varchar(256),
	"payment_intent" varchar(256),
	"payment_link" varchar(256),
	"payment_method_collection" varchar(256),
	"payment_method_configuration_details" jsonb,
	"payment_method_options" jsonb,
	"payment_method_types" jsonb,
	"payment_status" varchar(256),
	"phone_number_collection" jsonb,
	"recovered_from" varchar(256),
	"redirect_on_completion" varchar(256),
	"return_url" text,
	"saved_payment_method_options" jsonb,
	"setup_intent" varchar(256),
	"shipping_address_collection" jsonb,
	"shipping_cost" jsonb,
	"shipping_details" jsonb,
	"shipping_options" jsonb,
	"status" varchar(256),
	"submit_type" varchar(256),
	"subscription" varchar(256),
	"success_url" text,
	"tax_id_collection" jsonb,
	"total_details" jsonb,
	"ui_mode" varchar(256),
	"url" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_customer_subscriptions" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"application" varchar(256),
	"application_fee_percent" integer,
	"automatic_tax" jsonb,
	"billing_cycle_anchor" integer,
	"billing_cycle_anchor_config" jsonb,
	"billing_thresholds" jsonb,
	"cancel_at_period_end" boolean,
	"cancellation_details" jsonb,
	"collection_method" varchar(256),
	"currency" varchar(256),
	"customer" varchar(256),
	"days_until_due" integer,
	"default_payment_method" varchar(256),
	"default_source" varchar(256),
	"default_tax_rates" jsonb,
	"description" text,
	"discount" jsonb,
	"discounts" jsonb,
	"items" jsonb,
	"latest_invoice" varchar(256),
	"livemode" boolean,
	"metadata" jsonb,
	"on_behalf_of" varchar(256),
	"pause_collection" jsonb,
	"payment_settings" jsonb,
	"pending_invoice_item_interval" jsonb,
	"pending_setup_intent" varchar(256),
	"pending_update" jsonb,
	"schedule" varchar(256),
	"status" varchar(256),
	"test_clock" varchar(256),
	"transfer_data" jsonb,
	"trial_settings" jsonb,
	"cancel_at" timestamp with time zone,
	"canceled_at" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"current_period_start" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"next_pending_invoice_item_invoice" timestamp with time zone,
	"start_date" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"trial_start" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_customers" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"address" jsonb,
	"balance" integer,
	"cash_balance" jsonb,
	"currency" varchar(256),
	"default_source" varchar(256),
	"deleted" boolean,
	"delinquent" boolean,
	"description" text,
	"discount" jsonb,
	"email" varchar(256),
	"invoice_credit_balance" jsonb,
	"invoice_prefix" varchar(256),
	"invoice_settings" jsonb,
	"livemode" boolean,
	"metadata" jsonb,
	"name" varchar(256),
	"next_invoice_sequence" integer,
	"phone" varchar(256),
	"preferred_locales" jsonb,
	"shipping" jsonb,
	"sources" jsonb,
	"subscriptions" jsonb,
	"tax" jsonb,
	"tax_exempt" varchar(256),
	"tax_ids" jsonb,
	"test_clock" varchar(256),
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_invoices" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"account_country" varchar(256),
	"account_name" varchar(256),
	"account_tax_ids" jsonb,
	"amount_due" integer,
	"amount_paid" integer,
	"amount_remaining" integer,
	"amount_shipping" integer,
	"application" varchar(256),
	"application_fee_amount" integer,
	"attempt_count" integer,
	"attempted" boolean,
	"auto_advance" boolean,
	"automatic_tax" jsonb,
	"billing_reason" varchar(256),
	"charge" varchar(256),
	"collection_method" varchar(256),
	"currency" varchar(256),
	"custom_fields" jsonb,
	"customer" varchar(256),
	"customer_address" text,
	"customer_email" varchar(256),
	"customer_name" varchar(256),
	"customer_phone" varchar(256),
	"customer_shipping" jsonb,
	"customer_tax_exempt" varchar(256),
	"customer_tax_ids" jsonb,
	"default_payment_method" varchar(256),
	"default_source" varchar(256),
	"default_tax_rates" jsonb,
	"deleted" boolean,
	"description" text,
	"discount" jsonb,
	"discounts" jsonb,
	"ending_balance" integer,
	"footer" text,
	"from_invoice" jsonb,
	"hosted_invoice_url" text,
	"invoice_pdf" text,
	"issuer" jsonb,
	"last_finalization_error" jsonb,
	"latest_revision" varchar(256),
	"lines" jsonb,
	"livemode" boolean,
	"metadata" jsonb,
	"number" varchar(256),
	"on_behalf_of" varchar(256),
	"paid" boolean,
	"paid_out_of_band" boolean,
	"payment_intent" varchar(256),
	"payment_settings" jsonb,
	"post_payment_credit_notes_amount" integer,
	"pre_payment_credit_notes_amount" integer,
	"quote" varchar(256),
	"receipt_number" varchar(256),
	"rendering" jsonb,
	"shipping_cost" jsonb,
	"shipping_details" jsonb,
	"starting_balance" integer,
	"statement_descriptor" text,
	"status" varchar(256),
	"status_transitions" jsonb,
	"subscription" varchar(256),
	"subscription_details" jsonb,
	"subtotal" integer,
	"subtotal_excluding_tax" integer,
	"tax" integer,
	"test_clock" varchar(256),
	"threshold_reason" jsonb,
	"total" integer,
	"total_discount_amounts" jsonb,
	"total_excluding_tax" integer,
	"total_tax_amounts" jsonb,
	"transfer_data" jsonb,
	"subscription_proration_date" timestamp with time zone,
	"next_payment_attempt" timestamp with time zone,
	"webhooks_delivered_at" timestamp with time zone,
	"period_end" timestamp with time zone,
	"period_start" timestamp with time zone,
	"due_date" timestamp with time zone,
	"effective_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_payment_intents" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"amount" integer,
	"object" varchar(256),
	"amount_capturable" integer,
	"amount_details" jsonb,
	"amount_received" integer,
	"application" varchar(256),
	"application_fee_amount" integer,
	"automatic_payment_methods" jsonb,
	"cancellation_reason" varchar(256),
	"client_secret" text,
	"confirmation_method" varchar(256),
	"currency" varchar(256),
	"customer" varchar(256),
	"description" text,
	"invoice" varchar(256),
	"last_payment_error" text,
	"latest_charge" jsonb,
	"livemode" boolean,
	"metadata" jsonb,
	"next_action" jsonb,
	"on_behalf_of" jsonb,
	"payment_method" varchar(256),
	"payment_method_configuration_details" jsonb,
	"payment_method_options" jsonb,
	"payment_method_types" jsonb,
	"processing" jsonb,
	"receipt_email" varchar(256),
	"review" varchar(256),
	"setup_future_usage" varchar(256),
	"shipping" jsonb,
	"statement_descriptor" varchar(256),
	"statement_descriptor_suffix" varchar(256),
	"status" varchar(256),
	"transfer_data" jsonb,
	"transfer_group" varchar(256),
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"canceled_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_refunds" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"object" varchar(256),
	"amount" integer,
	"balance_transaction" varchar(256),
	"charge" varchar(256),
	"currency" varchar(256),
	"description" text,
	"destination_details" jsonb,
	"failure_balance_transaction" varchar(256),
	"failure_reason" varchar(256),
	"instructions_email" varchar(256),
	"metadata" jsonb,
	"next_action" jsonb,
	"payment_intent" varchar(256),
	"reason" varchar(256),
	"receipt_number" varchar(256),
	"source_transfer_reversal" varchar(256),
	"status" varchar(256),
	"transfer_reversal" varchar(256),
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "email_messages" ALTER COLUMN "requested_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_messages" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_messages" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_domains" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_domains" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_domains" ALTER COLUMN "verification_expire_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_domains" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_invitations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "last_active_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "last_integrations_refresh_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "last_active_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expire_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "abandon_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sms_messages" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sms_messages" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_addresses" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "external_accounts" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "passkeys" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_numbers" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "private_metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "public_metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "saml_accounts" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "unsafe_metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "web3_wallets" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "vendor_identity_map" SET DATA TYPE jsonb;--> statement-breakpoint
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
