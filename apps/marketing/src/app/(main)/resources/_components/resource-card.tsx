import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@limelight/shared-ui-kit/ui/card';
import Image from 'next/image';
import Author from './author';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';

type ResourceCardProps = {
  alt?: string;
  author?: string | null;
  imageUrl?: string | null;
  preview?: string | null;
  publishedAt?: string | null;
  slug: string;
  category?: string | null;
  timeToRead?: number | null;
  title?: string | null;
};

export default function ResourceCard({
  alt,
  author,
  imageUrl,
  preview,
  publishedAt,
  slug,
  category,
  timeToRead,
  title,
}: ResourceCardProps) {
  return (
    <Link data-test-article-link href={`/resources/${slug}`}>
      <Card
        data-test-article-item
        className="flex cursor-pointer flex-col border-none shadow-none rounded-none bg-background max-w-[768px] tablet:w-full laptop:w-[282px] desktop:w-[367px]"
      >
        <CardHeader className="p-0">
          <div className="relative w-full h-[240px] pb-5">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={alt ?? 'Image for Resource'}
                className="object-cover rounded"
                fill
              />
            ) : (
              <p className="text-center">No Image Available</p>
            )}
          </div>
          <Author
            author={author}
            publishedAt={publishedAt}
            timeToRead={timeToRead}
          />
        </CardHeader>

        <CardContent className="p-0">
          <CardTitle
            data-test-article-card-title
            className="text-[#00152A] leading-[0.95] font-light text-[2rem] tablet:text-[2.5rem]"
          >
            {title}
          </CardTitle>
          <CardDescription
            data-test-summary
            className="text-[#737C8B] leading-[2] text-[1rem] pt-2"
          >
            {preview}
          </CardDescription>

          {category && (
            <div className="flex mt-6 gap-2 flex-row flex-wrap">
              <Badge
                data-test-category
                variant="outline"
                className="border border-[#CDD5DF] text-[#737C8B] rounded-md px-4 py-2 w-fit"
              >
                {category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
