export const maxDuration = 15; // This function can run for a maximum of 15 seconds

import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import { inngestFunctions } from '../../../inngest/handlers';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
});
