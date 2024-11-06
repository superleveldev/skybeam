import { inngest } from '../../client';
import { db } from '../../../server/db';
import { smsMessages } from '@limelight/shared-drizzle';
import { ClerkEvents } from '@limelight/shared-inngest-events/vendors/clerk';

// these are missing in the Clerk webhook typings for some reason.
type extraWebhookFields = {
  delivered_by_clerk: boolean;
  slug: string;
  user_id: string;
};

const mapSmsEventToDb = (
  payload: ClerkEvents['clerk/sms.created']['data'] & extraWebhookFields,
) => {
  return {
    appDomainName: payload.data?.app?.domain_name,
    appLogoImageUrl: payload.data?.app?.logo_image_url,
    appLogoUrl: payload.data?.app?.logo_url,
    appName: payload.data?.app?.name,
    appUrl: payload.data?.app?.url,
    otpCode: payload.data?.otp_code,
    deliveredByClerk: payload.delivered_by_clerk,
    fromPhoneNumber: payload.from_phone_number,
    message: payload.message,
    phoneNumberId: payload.phone_number_id,
    slug: payload.slug,
    status: payload.status,
    toPhoneNumber: payload.to_phone_number,
    userId: payload.user_id,
  };
};

export const clerkSmsCreated = inngest.createFunction(
  { id: 'clerk-sms-created' },
  { event: 'clerk/sms.created' },
  async ({ event, step }) => {
    await step.run('save to PS', () => {
      return db.insert(smsMessages).values({
        id: event.data.id,
        ...mapSmsEventToDb(
          event.data as ClerkEvents['clerk/sms.created']['data'] &
            extraWebhookFields,
        ),
      });
    });
  },
);
