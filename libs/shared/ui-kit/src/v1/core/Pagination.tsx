import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { getParams } from '@limelight/shared-utils/index';
import { SearchParams } from './types';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  searchParams: SearchParams;
  total: number;
}

export default function Pagination({
  searchParams,
  total,
  ...attrs
}: PaginationProps) {
  const {
    limit: limitString,
    page: pageString,
    ...formattedSearchParams
  } = getParams({
    ...searchParams,
  });
  const limit = parseInt(limitString);
  const page = parseInt(pageString);
  const totalPages = Math.ceil(total / limit);

  let first = 1;
  let middle = 2;
  let last = 3;

  if (page !== 1) {
    first = page === totalPages ? totalPages - 2 : page - 1;
    middle = page === totalPages ? totalPages - 1 : page;
    last = page === totalPages ? totalPages : page + 1;
  }

  return (
    <PaginationWrapper {...attrs}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none' : ''}
            href={{
              query: { limit, page: page - 1, ...formattedSearchParams },
            }}
          />
        </PaginationItem>
        {first > 1 && (
          <PaginationItem>
            <PaginationLink
              href={{ query: { limit, page: 1, ...formattedSearchParams } }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {first > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {first > 0 && (
          <PaginationItem>
            <PaginationLink
              href={{ query: { limit, page: first, ...formattedSearchParams } }}
              isActive={page === first}
            >
              {first}
            </PaginationLink>
          </PaginationItem>
        )}
        {totalPages >= middle && (
          <PaginationItem>
            <PaginationLink
              href={{
                query: { limit, page: middle, ...formattedSearchParams },
              }}
              isActive={page === middle}
            >
              {middle}
            </PaginationLink>
          </PaginationItem>
        )}
        {totalPages >= last && (
          <PaginationItem>
            <PaginationLink
              href={{ query: { limit, page: last, ...formattedSearchParams } }}
              isActive={page === last}
            >
              {last}
            </PaginationLink>
          </PaginationItem>
        )}
        {last < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {last < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={{
                query: { limit, page: totalPages, ...formattedSearchParams },
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none' : ''}
            href={{
              query: { limit, page: page + 1, ...formattedSearchParams },
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
