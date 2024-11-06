import React from 'react';
import { TableCell, TableRow } from '../../ui/table';

export default function NoResults({ columns }: { columns: number }) {
  return (
    <TableRow className="bg-white p-4 text-muted-foreground w-full">
      <TableCell colSpan={columns} className="h-24 text-center">
        No results found
      </TableCell>
    </TableRow>
  );
}
