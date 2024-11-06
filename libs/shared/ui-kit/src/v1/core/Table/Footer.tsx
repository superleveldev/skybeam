import { TableCell, TableRow, TableFooter } from '../../ui/table';
import { flexRender, useReactTable } from '@tanstack/react-table';

interface FooterProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function Footer<T>({ table, ...attrs }: FooterProps<T>) {
  return (
    <TableFooter {...attrs}>
      {table.getFooterGroups().map((footerGroup) => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <TableCell key={header.id}>
              {flexRender(header.column.columnDef.footer, header.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}
