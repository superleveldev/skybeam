import { EventSchemas, Inngest, type InngestMiddleware } from 'inngest';
import { InngestEvents } from '@limelight/shared-inngest-events';
import postHogMiddleware from './ph-middleware';
import { env } from '../env';

const middleware = [];

if (env.ENABLE_POSTHOG_INNGEST_EVENTS) middleware.push(postHogMiddleware);

export const inngest = new Inngest({
  id: 'skybeam-dashboard',
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
  ...(middleware.length
    ? { middleware: middleware as InngestMiddleware.Stack }
    : null),
});
