import PostHogClient from '../app/posthog';
import { type GetStepTools, InngestMiddleware } from 'inngest';
import { env } from '../env';

const posthog = PostHogClient();

const postHogMiddleware = new InngestMiddleware({
  name: 'Posthog events middleware',
  init({ client }) {
    return {
      // For every function run...
      onFunctionRun({ ctx: { event, runId } }) {
        let step: GetStepTools<typeof client>;

        return {
          // Grab the step tooling
          transformInput({ ctx }) {
            step = ctx.step;
          },

          // Add the step before any memoization or execution starts.
          // i.e. as soon as possible after the function is started.
          beforeMemoization() {
            // note on alias; use distinctId as fingerprint, but if real user ID is
            // available, use it as the distinctId and fingerprint as the alias
            const distinctId =
              event.user?.id || event.data?.user_id || event.name;

            /**
             * Add any event here that we "dont" want showing up in PostHog
             * ex. things that have little value and/or too high of volume
             */
            const eventsToSkip = [
              'inngest/function.failed',
              'posthog/webhook.received',
            ];

            if (eventsToSkip.includes(event.name)) return;

            step.run('PostHog: Submit Event', () => {
              posthog.capture({
                distinctId: distinctId,
                event: event.name,
                properties: {
                  ...event.data,
                  inngestRunID: runId,
                  branch: event.data?.branch ?? env.BRANCH,
                },
              });
              return {
                distinctId: distinctId,
                event: event.name,
                properties: {
                  ...event.data,
                  inngestRunID: runId,
                  branch: event.data?.branch ?? env.BRANCH,
                },
              };
            });
          },
        };
      },
    };
  },
});

export default postHogMiddleware;
