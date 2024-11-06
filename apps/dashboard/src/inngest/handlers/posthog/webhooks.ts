import { inngest } from '../../client';

import { Client } from 'intercom-client';
import { env } from '../../../env';
import { NonRetriableError } from 'inngest';

export const posthogWebhookReceived = inngest.createFunction(
  { id: 'posthog-webhook-received' },
  { event: 'posthog/webhook.received' },
  async ({ event, step }) => {
    const eventsToIgnore: string[] = [];

    await step.run('Forward event to Intercom', async () => {
      const eventName = event.data.event.event;
      const metadata = event.data;

      if (eventsToIgnore.includes(eventName)) return;

      const client = new Client({
        tokenAuth: { token: env.INTERCOM_ACCESS_TOKEN },
      });

      /**
       * This forwards events to Intercom, but only if it's from a real user
       */
      if (!event.data.person?.id) return;

      /**
       * Intercom doesn't like metadata with nested properties that don't fit currency/values
       */
      const flatMetadata: Record<string, any> = {};

      for (const key in metadata.event.properties) {
        if (
          typeof metadata.event.properties[key] !== 'object' &&
          !Array.isArray(metadata.event.properties[key])
        ) {
          flatMetadata[key] = metadata.event.properties[key];
        }
      }

      return client.events
        .create({
          eventName,
          createdAt: Math.floor(
            new Date(event.data.event.timestamp).getTime() / 1000,
          ),
          userId: event.data.event?.distinct_id,
          metadata: flatMetadata,
        })
        .catch((error) => {
          // we know these can happen, and we're fine with it
          if (['User Not Found'].includes(error.message)) return error.message;

          error.body?.errors.forEach(
            (err: { message: any; type: any; code: any }) => {
              console.error(`Error: ${err.message}, Code: ${err.code}`);
            },
          );

          console.error(error);
          throw new NonRetriableError('Event forwarding failed');
        });
    });
  },
);
