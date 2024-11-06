import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { db } from '../db';

export const createContextInner = async () => {
  return {
    db,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return await createContextInner();
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
