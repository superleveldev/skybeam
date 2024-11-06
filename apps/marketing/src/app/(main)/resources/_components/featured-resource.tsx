import Image from 'next/image';
import Link from 'next/link';

import { Tag } from './types';
import Author from './author';
import Tags from './tags';

type FeaturedResourceProps = {
  alt?: string;
  author?: string | null;
  imageUrl?: string;
  preview?: string | null;
  publishedAt?: string | null;
  slug: string;
  tags?: Tag[];
  timeToRead?: number | null;
  title?: string | null;
};

export default async function FeaturedResource({
  alt,
  author,
  imageUrl,
  preview,
  tags,
  publishedAt,
  slug,
  timeToRead,
  title,
}: FeaturedResourceProps) {
  return (
    <section
      data-section="featured-resource-section"
      className="flex justify-center pb-12 pt-16 tablet:pt-11 desktop:pt-11 bg-background mobile:px-4 tablet:px-6 laptop:px-10 desktop:px-[152px]"
    >
      <div className="flex flex-col justify-center w-full desktop:max-w-[71rem]">
        <Link href={`/resources/${slug}`}>
          <div className="content-center relative bg-[#D9D9D9] h-[222px] tablet:w-full tablet:h-[426px]  desktop:h-[354px] laptop:w-full laptop:h-[354px]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={alt ?? 'Illustration for Resources Section'}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="absolute inset-0"
              />
            ) : (
              <p className="text-center">Illustration</p>
            )}
          </div>
          <Author
            author={author}
            publishedAt={publishedAt}
            timeToRead={timeToRead}
          />
          <h2 className="text-[#00152A] font-light leading-[0.9] text-[2rem] pb-2 tablet:text-[2.5rem]">
            {title}
          </h2>
          <p className="text-[#737C8B]">{preview}</p>
          <Tags tags={tags} />
        </Link>
      </div>
    </section>
  );
}
