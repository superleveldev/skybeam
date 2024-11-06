import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { flexRender, Header } from '@tanstack/react-table';
import { TableHead } from '../../ui/table';
import Link from 'next/link';
import { cn, getParams } from '@limelight/shared-utils/index';
import { SearchParams } from '../types';
import { RowData } from '@tanstack/react-table';
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    disableSorting: boolean;
  }
}

interface HeaderCellProps<TData, TValue> {
  buttonClass?: string;
  className?: string;
  header: Header<TData, TValue>;
  searchParams?: SearchParams;
  wrapperClass?: string;
  sortable?: boolean;
}

export default function HeaderCell<TData, TValue>({
  buttonClass = '',
  header,
  searchParams,
  wrapperClass = '',
  sortable = true,
  ...attrs
}: HeaderCellProps<TData, TValue>) {
  if (header.column.columnDef.meta?.disableSorting) {
    return (
      <TableHead
        className={cn('items-center space-x-2', wrapperClass)}
        colSpan={header.colSpan}
        {...attrs}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
    );
  }

  const formattedSearchParams = getParams({
    ...searchParams,
    search: searchParams?.search,
    sort: header.column.id,
    sortDir: header.column.getIsSorted() === 'asc' ? 'desc' : 'asc',
  });

  return (
    <TableHead
      className={cn('items-center space-x-2', wrapperClass)}
      colSpan={header.colSpan}
      {...attrs}
    >
      <Link
        href={{ query: formattedSearchParams }}
        className={cn({ 'pointer-events-none': !sortable })}
      >
        <Button
          data-testid={header.id}
          className={cn('-ml-3 h-8 data-[state=open]:bg-accent', buttonClass)}
          onClick={() =>
            header.column.toggleSorting(header.column.getIsSorted() === 'asc')
          }
          size="sm"
          variant={null}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {sortable && !header.column.getIsSorted() && (
            <ArrowDownUpIcon className="ml-2 size-4" />
          )}
          {sortable && header.column.getIsSorted() === 'desc' && (
            <ArrowDownIcon className="ml-2 size-4" />
          )}
          {sortable && header.column.getIsSorted() === 'asc' && (
            <ArrowUpIcon className="ml-2 size-4" />
          )}
        </Button>
      </Link>
    </TableHead>
  );
}
