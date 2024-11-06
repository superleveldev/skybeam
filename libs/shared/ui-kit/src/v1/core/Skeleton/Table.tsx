import {
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHead,
  TableRow,
  Table,
} from '../../ui/table';
import { Skeleton } from '../../ui/skeleton';

export function HeaderSkeleton({ columns }: { columns: number }) {
  return (
    <TableHeader className="bg-gray-100">
      <TableRow>
        {Array.from({ length: columns }).map((_, i) => (
          <TableHead key={i}>
            <Skeleton className="h-[20px] w-auto bg-white" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export function BodySkeleton({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  return (
    <TableBody className="bg-white">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={i}>
              <Skeleton className="h-[20px] w-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export function FooterSkeleton({ columns }: { columns: number }) {
  return (
    <TableFooter>
      <TableRow>
        {Array.from({ length: columns }).map((_, i) => (
          <TableCell key={i}>
            <Skeleton className="h-[20px] w-auto bg-white" />
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
}

export default function TableSkeleton({
  columns = 1,
  rows = 3,
  ...attrs
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <Table {...attrs}>
      <HeaderSkeleton columns={columns} />
      <BodySkeleton columns={columns} rows={rows} />
      <FooterSkeleton columns={columns} />
    </Table>
  );
}
