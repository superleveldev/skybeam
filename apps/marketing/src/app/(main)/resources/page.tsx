import { urlFor } from '@limelight/shared-sanity';
import MainSection from './_components/main-section';
import ResourceFilter from './_components/filters';
import FeaturedResource from './_components/featured-resource';
import ResourceCard from './_components/resource-card';
import { api } from '../../../trpc/server';
import { ResourcesQueryParams } from './_components/types';
import { Contact } from '../../_components/contact';

export const generateMetadata = () => ({
  title: 'CTV Advertising Tips, Guides & Insights',
  description:
    'Discover Skybeam’s collection of resources, from guides to industry insights and tips, crafted to help you master TV advertising and amplify your marketing results! 🎯',
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_MARKETING_URL}/social-share.png`,
        width: 1200,
        height: 630,
        alt: 'Skybeam: CTV & Streaming TV Advertising Platform',
      },
    ],
  },
});

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: ResourcesQueryParams;
}) {
  const resourcesPage = await api.resources.getResourcesPageConfig.query();
  const mainAsset =
    resourcesPage?.mainImage?.asset && urlFor(resourcesPage?.mainImage?.asset);
  const categories = resourcesPage?.categories ?? [];
  const mainImageUrl = mainAsset?.width(1440 * 2).url();
  const featuredResource = resourcesPage?.featured;
  const featuredAsset =
    featuredResource?.mainImage?.asset &&
    urlFor(featuredResource?.mainImage?.asset);
  const featuredImageUrl = featuredAsset?.width(1135 * 2).url();

  const resources = await api.resources.getResourcesByCategory.query({
    category: searchParams.category,
  });

  return (
    <div className="bg-background">
      <div className="max-w-full">
        <MainSection
          title={resourcesPage?.title ?? ''}
          imageUrl={mainImageUrl}
          subtitle={resourcesPage?.subtitle ?? ''}
          alt={resourcesPage?.mainImage?.alt ?? ''}
        />
        <ResourceFilter categories={categories} />
        <FeaturedResource
          slug={featuredResource?.slug || ''}
          timeToRead={featuredResource?.timeToRead}
          publishedAt={featuredResource?.publishedAt}
          author={featuredResource?.author?.name}
          title={featuredResource?.title}
          tags={featuredResource?.tag ?? []}
          preview={featuredResource?.preview}
          imageUrl={featuredImageUrl}
        />
        <div className="flex justify-center w-full bg-background">
          <div
            data-section="resources-list-section"
            className="grid px-4 pb-12 tablet:px-6 laptop:px-10 desktop:px-0 gap-x-4 gap-y-12 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3 desktop:max-w-[71rem]"
          >
            {resources.map((resource) => {
              const imageUrl =
                resource?.mainImage?.asset &&
                urlFor(resource?.mainImage?.asset)
                  .width(367 * 2)
                  .url();
              return (
                <ResourceCard
                  key={resource._id}
                  author={resource.author?.name}
                  category={resource?.category?.title}
                  imageUrl={imageUrl}
                  preview={resource.preview}
                  publishedAt={resource.publishedAt}
                  slug={resource.slug!}
                  title={resource.title}
                />
              );
            })}
          </div>
        </div>
        <div>
          <Contact />
        </div>
      </div>
    </div>
  );
}
