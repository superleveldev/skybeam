import { inngest } from '../../client';
import { env } from '../../../env';

import { IncomingWebhookSendArguments } from '@slack/webhook';
import { NonRetriableError } from 'inngest';

async function writeToSlackFetch(
  payload: IncomingWebhookSendArguments,
): Promise<Response> {
  return fetch(env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Skybeam',
      icon_emoji: ':skybeam_1:',
      ...payload,
    }),
  });
}

export const writeToSlack = inngest.createFunction(
  {
    id: 'slack-write-message',
  },
  { event: 'slack/write.message' },
  async ({ event, step }) => {
    const resp = await step.run('Write to slack', async () => {
      const resp = await writeToSlackFetch(event.data);
      return await resp.text();
    });

    if (resp !== 'ok') {
      throw new NonRetriableError(`Could not write to Slack - ${resp}`);
    }
  },
);

export const slackHandlers = [writeToSlack];
