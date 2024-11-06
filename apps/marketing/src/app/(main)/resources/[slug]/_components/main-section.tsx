import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import Author from '../../_components/author';
import { AuthorTitle } from '../../_components/types';
import { Avatar, AvatarImage } from '@limelight/shared-ui-kit/ui/avatar';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import { SocialNetwork, Author as AuthorType, MainImage } from '../types';
import { urlFor } from '@limelight/shared-sanity';
import Section from './section';

type MainSectionProps = {
  author?: AuthorType;
  title?: string | null;
  category?: string | null;
  socialNetwork?: SocialNetwork;
  mainImage?: MainImage;
} & Omit<AuthorTitle, 'author'>;

export default async function MainSection({
  author,
  publishedAt,
  timeToRead,
  category,
  socialNetwork,
  mainImage,
  title,
}: MainSectionProps) {
  const avatar =
    author?.image?.asset &&
    urlFor(author?.image?.asset)
      .width(100 * 2)
      .url();
  const mainImageUrl =
    mainImage?.asset &&
    urlFor(mainImage?.asset)
      .width(1137 * 2)
      .url();
  return (
    <div className="max-w-[320px] desktop:max-w-[1440px] laptop:max-w-[960px] tablet:max-w-full">
      <Section>
        <Link
          href="/resources"
          replace
          className="text-[#00152A] hover:underline items-center flex flex-row mb-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 text-[0.875rem] tablet:text-[1rem]">
            All Blogposts
          </span>
        </Link>
        {category && (
          <Badge
            variant="outline"
            className="border border-[#737C8B] text-[#737C8B] text-[0.875rem] rounded-md px-4 py-0 tablet:py-1 w-fit my-4"
          >
            {category}
          </Badge>
        )}
        <h1 className="text-[#00152A] font-light mb-3 leading-[0.95] tablet:mb-6">
          {title}
        </h1>
        <div className="py-4 flex flex-col gap-y-4 laptop:flex-row items-start laptop:justify-between laptop:items-center border-t border-b border-[#CDDFFD]">
          <div className="flex flex-row items-center">
            <Avatar className="mr-4 w-14 h-14">
              {avatar && <AvatarImage src={avatar} />}
            </Avatar>
            <Author
              author={author?.name}
              timeToRead={timeToRead}
              publishedAt={publishedAt}
              twoLines
            />
          </div>
          <div className="flex-row space-x-1 pb laptop:pb-0 ">
            {socialNetwork?.map(({ url, image, _id }) => {
              const imageLink = image?.asset && urlFor(image?.asset).url();

              return (
                <Link href={url!} key={_id}>
                  <Badge
                    variant="outline"
                    className="shadow border bg-background border-[#F4F6FF] text-[#013D3A] rounded-[10px] w-fit p-3"
                  >
                    {imageLink && (
                      <Image
                        src={imageLink}
                        alt="Social network"
                        width={20}
                        height={20}
                      />
                    )}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
      <div className="mt-6 tablet:mt-10 laptop:mt-16 desktop:mt-16 desktop:px-[152px] laptop:px-10 pb-0">
        <Section className="w-full h-[149px] tablet:h-[264px] laptop:h-[410px] desktop:h-[528px] relative">
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={mainImage?.alt ?? 'Main Image'}
              fill
              className="absolute object-cover object-center inset-0 rounded-[6px]"
            />
          )}
        </Section>
      </div>
    </div>
  );
}
