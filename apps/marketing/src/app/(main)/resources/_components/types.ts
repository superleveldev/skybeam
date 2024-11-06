import { api } from '../../../../trpc/server';
export type Tag = {
  _id: string;
  name: string | null;
};

export type AuthorTitle = {
  author?: string | null;
  publishedAt?: string | null;
  timeToRead?: number | null;
};

export type ResourcesQueryParams = Parameters<
  typeof api.resources.getResourcesByCategory.query
>[0];
