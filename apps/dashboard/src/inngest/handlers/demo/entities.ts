import { inngest } from '../../client';

export const entityClicked = inngest.createFunction(
  {
    id: 'demo-entity-clicked',
  },
  { event: 'demo/entity.clicked' },
  async ({ event, step }) => {
    const name = event.data.name;

    await step.run('Output the name of the clicked entity', async () => {
      return `Entity clicked named ${name}`;
    });

    await step.run('Do something else', async () => {
      return 'Something else';
    });
  },
);
