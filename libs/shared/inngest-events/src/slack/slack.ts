import { IncomingWebhookSendArguments } from '@slack/webhook';

type SlackMessageType = {
  data: IncomingWebhookSendArguments;
};

export type SlackWebhookEvents = {
  'slack/write.message': SlackMessageType;
};
