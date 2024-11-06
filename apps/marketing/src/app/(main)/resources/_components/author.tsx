import type { AuthorTitle } from './types';
import { cn } from '@limelight/shared-utils/classnames/cn';

const formatDate = (date?: string | null) =>
  date ? `${date.slice(0, 10)}` : '';
const formatTimeToRead = (time?: number | null) =>
  time ? ` • ${time} min to read` : '';

export default function Author({
  author,
  publishedAt,
  timeToRead,
  twoLines = false,
}: AuthorTitle & { twoLines?: boolean }) {
  return (
    <div
      data-test-author
      className={cn(
        'text-[#737C8B] pt-8 pb-2',
        twoLines ? 'flex flex-col py-0' : 'flex gap-x-1 items-center',
      )}
    >
      <p
        className={cn(
          twoLines && 'text-[0.875rem] font-semibold leading-[1.5] text-black',
        )}
      >
        {author}
      </p>
      <p
        className={cn(
          twoLines && 'text-[#737C8B] text-[0.875rem] leading-[1.5]',
        )}
      >
        {twoLines ? '' : ' • '}
        {formatDate(publishedAt)}
        {formatTimeToRead(timeToRead)}
      </p>
    </div>
  );
}
