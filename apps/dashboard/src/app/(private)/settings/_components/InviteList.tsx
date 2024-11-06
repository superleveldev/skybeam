'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import InviteOptions from './InviteOptions';

type InviteData = {
  id: string;
  name: string;
  email: string | undefined;
  createdAt: number;
  updatedAt: number;
  status?: string;
  role: string;
};

export const columns: (currentUserRole: string) => ColumnDef<InviteData>[] = (
  currentUserRole,
) => [
  {
    accessorKey: 'name',
    cell: (props) => props.getValue() || '-',
    header: 'Name',
    id: 'name',
  },
  {
    accessorKey: 'email',
    cell: (props) => props.getValue() ?? '-',
    header: 'Email',
    id: 'email',
  },

  {
    accessorKey: 'role',
    cell: (props) =>
      typeof props.getValue() === 'string'
        ? (props.getValue() as string).split(':')?.at(1)
        : '-',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    cell: (props) => {
      const status = props.getValue();
      if (!status) {
        return '-';
      }
      if (status === 'accepted') {
        return <Badge>Accepted</Badge>;
      }

      if (status === 'pending') {
        return <Badge variant="secondary">Pending</Badge>;
      }

      if (status === 'revoked') {
        return <Badge variant="destructive">Revoked</Badge>;
      }
    },
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    cell: (props) => new Date(props.getValue() as number).toDateString(),
    header: 'Invited On',
  },
  {
    accessorKey: 'id',
    cell: (props) => (
      <InviteOptions
        inviteId={props.getValue() as string}
        disabled={
          props.row.getValue('status') === 'revoked' ||
          currentUserRole !== 'org:admin'
        }
      />
    ),
    header: '',
    id: 'menu',
    meta: {
      disableSorting: true,
    },
  },
];

export default function InviteList({
  invites,
  searchParams,
  currentUserRole,
}: {
  invites: InviteData[];
  searchParams: SearchParams;
  currentUserRole: string;
}) {
  const table = useReactTable({
    columns: columns(currentUserRole),
    data: invites,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Header searchParams={searchParams} table={table} sortable={false} />
      <Body data-testid="invite-list-body" table={table} />
    </>
  );
}
