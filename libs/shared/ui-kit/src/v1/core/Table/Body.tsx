import {
  TableBody as TableBodyWrapper,
  TableCell,
  TableRow,
} from '../../ui/table';
import { NoResults } from './index';
import { flexRender, useReactTable } from '@tanstack/react-table';

interface BodyProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function TableBody<T>({ table, ...attrs }: BodyProps<T>) {
  const rows = table.getRowModel().rows;
  const columns = table.getAllColumns().length;
  return (
    <TableBodyWrapper {...attrs}>
      {!!rows.length &&
        rows.map((row) => (
          <TableRow className="bg-white" key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      {!rows.length && <NoResults columns={columns} />}
    </TableBodyWrapper>
  );
}
