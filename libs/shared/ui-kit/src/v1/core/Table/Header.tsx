import { TableHeader, TableRow } from '../../ui/table';
import { HeaderCell } from './index';
import { useReactTable } from '@tanstack/react-table';
import { SearchParams } from '../types';

interface HeaderProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  searchParams?: SearchParams;
  table: ReturnType<typeof useReactTable<T>>;
  sortable?: boolean;
}

export default function Header<T>({
  searchParams,
  table,
  sortable = true,
  ...attrs
}: HeaderProps<T>) {
  return (
    <TableHeader {...attrs}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          className="bg-gray-100 hover:bg-gray-100"
          key={headerGroup.id}
        >
          {headerGroup.headers.map((header) => (
            <HeaderCell
              header={header}
              key={header.id}
              searchParams={searchParams}
              sortable={sortable}
            />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
