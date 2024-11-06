import { inngest } from '../../client';
import { db } from '../../../server/db';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';
import { emailMessages } from '@limelight/shared-drizzle';

const mapEmailMessageEventToDb = (
  payload: ClerkEvents['clerk/email.created']['data'],
) => {
  return {
    body: payload.body,
    bodyPlain: payload.body_plain,
    appDomainName: payload.data?.app?.domain_name,
    appLogoImageUrl: payload.data?.app?.logo_image_url,
    appLogoUrl: payload.data?.app?.logo_url,
    appName: payload.data?.app?.name,
    appUrl: payload.data?.app?.url,
    otpCode: payload.data?.opt_code,
    requestedAt: new Date(payload.data?.requested_at),
    requestedBy: payload.data?.requested_by,
    themeButtonTextColor: payload.data?.theme?.button_text_color,
    themePrimaryColor: payload.data?.theme?.primary_color,
    themeShowClerkBranding: payload.data?.theme?.show_clerk_branding,
    deliveredByClerk: payload.delivered_by_clerk,
    emailAddressId: payload.email_address_id,
    fromEmailName: payload.from_email_name,
    slug: payload.slug,
    source: 'clerk',
    status: payload.status,
    subject: payload.subject,
    toEmailAddress: payload.to_email_address,
    userId: payload.user_id,
  };
};

export const clerkEmailMessageCreated = inngest.createFunction(
  { id: 'clerk-email-message-created' },
  { event: 'clerk/email.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(emailMessages).values({
        id: event.data.id,
        ...mapEmailMessageEventToDb(event.data),
      });
    });
  },
);
