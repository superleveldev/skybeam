import { createClient } from '@sanity/client';

const getSanityClient = () => {
  return createClient({
    projectId: '2827cj7b',
    dataset:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    apiVersion: '2024-03-11',
    // Set to `true` for production environments
    useCdn: false,
  });
};

export const client = getSanityClient();
