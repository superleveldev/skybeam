import { api } from '../../../../trpc/server';
import MainSection from './_components/main-section';
import SanityContent from '../../../_components/sanity/sanity-content';

type ResourceProps = {
  params: {
    slug: string;
  };
};

export const generateMetadata = async ({ params }: ResourceProps) => {
  const { slug } = params;
  const resourceMeta = await api.resources.getResourceMetaData.query({ slug });

  return {
    title: resourceMeta?.metaData?.title,
    description: resourceMeta?.metaData?.description,
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
  };
};

export default async function Resource({ params }: ResourceProps) {
  const resourcePage = await api.resources.getResource.query({
    slug: params.slug,
  });
  return (
    <div
      data-section="article-section"
      className="bg-background pb-20 flex flex-col items-center"
    >
      <div className="bg-[#F4F6FF] w-full flex justify-center laptop:pb-10 desktop:pb-20">
        <MainSection
          author={resourcePage?.author}
          category={resourcePage?.category?.title}
          publishedAt={resourcePage?.publishedAt}
          socialNetwork={resourcePage?.socialNetwork}
          timeToRead={resourcePage?.timeToRead}
          title={resourcePage?.title}
          mainImage={resourcePage?.mainImage}
        />
      </div>
      <SanityContent content={resourcePage?.content} />
    </div>
  );
}
