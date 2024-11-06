import { inngest } from '../../client';

export const thingNavigated = inngest.createFunction(
  {
    id: 'demo-thing-navigated',
  },
  { event: 'demo/thing.navigated' },
  async ({ event, step }) => {
    const someValue = event.data.someValue;

    await step.run('Output the value of the navigated thing', async () => {
      return `Thing navigated with value of ${someValue}`;
    });

    await step.run('Do something else', async () => {
      return 'Something else';
    });
  },
);
