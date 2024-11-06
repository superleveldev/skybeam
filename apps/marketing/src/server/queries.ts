'use server';

import { createClient } from '@sanity/client';
import { env } from '../env';

import {
  client,
  RESOURCE_QUERY,
  RESOURCES_PAGE_QUERY,
  RESOURCES_QUERY,
  OUR_TEAM_QUERY,
  RESOURCE_META_QUERY,
} from '@limelight/shared-sanity';

const options = { next: { revalidate: 60 } };

const getSanityClient = () => {
  return createClient({
    projectId: env.SANITY_BLOG_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2024-03-11',
    // Set to `true` for production environments
    useCdn: env.BRANCH === 'main',
  });
};

export const getResource = async ({ slug }: { slug: string }) =>
  client.fetch(RESOURCE_QUERY, { slug }, options);

export const getResourceMetaData = async ({ slug }: { slug: string }) =>
  client.fetch(RESOURCE_META_QUERY, { slug }, options);

export const getResourcesPage = async () =>
  client.fetch(RESOURCES_PAGE_QUERY, {}, options);

export const getResources = async (category?: string) => {
  const queryParams = { category: category ?? null };
  return client.fetch(RESOURCES_QUERY, queryParams);
};

export const getBlogPosts = async ({
  limit,
  slug,
}: {
  limit?: number;
  slug?: string;
}) => {
  const client = getSanityClient();

  const query = `*[_type == "post"]${
    slug ? `[slug.current == "${slug}"]` : ''
  }[${limit ? `0...${limit}` : ''}] | order(_createdAt desc) {
    ...,
    author->,
    mainImage {
      ...,
      asset->
    },
    categories[]->,
    body
  }`;

  // TODO: GraphQL typings
  const results: any[] = await client.fetch(query);

  /**
   * Map this into a more pleasant format for usage in-app
   */
  return results.map((item) => {
    return {
      id: item._id,
      title: item.title,
      slug: item.slug.current,
      body: item.body,
      mainImageUrl: item.mainImage?.asset?.url,
      categories: item.categories?.map((category: any) => {
        return {
          id: category._id,
          title: category.title,
          description: category.description,
        };
      }),
      author: {
        id: item.author?._id,
        name: item.author?.name,
        slug: item.author?.slug?.current,
        // TODO: imageUrl
        // imageUrl: item.author?.image?.asset,
      },
      publishedAt: new Date(item.publishedAt),
      createdAt: new Date(item._createdAt),
    };
  });
};

export const getOurTeam = async () => {
  return client.fetch(OUR_TEAM_QUERY);
};
