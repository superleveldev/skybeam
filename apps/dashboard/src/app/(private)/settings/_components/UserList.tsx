'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { Campaign } from '../../campaigns/types';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import UserOptions from './UserOptions';
import UserRoleSelect from './UserRoleSelect';

type UserData = {
  id: string;
  name: string;
  email: string | undefined;
  createdAt: number;
  membership: { role: string; id: string };
};

const MembershipMap = {
  'org:member': 'Member',
  'org:admin': 'Admin',
};

export const columns: (currentUserRole: string) => ColumnDef<UserData>[] = (
  currentUserRole,
) => [
  {
    accessorKey: 'name',
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
    accessorKey: 'membership.role',
    cell: (props) => {
      return currentUserRole === 'org:admin' ? (
        <UserRoleSelect
          role={props.getValue() as string}
          userId={props.row.original.id as string}
        />
      ) : (
        MembershipMap[props.getValue() as keyof typeof MembershipMap]
      );
    },
    header: 'Role',
    meta: { disableSorting: true },
  },
  {
    accessorKey: 'createdAt',
    cell: (props) => new Date(props.getValue() as number).toDateString(),
    header: 'Created On',
  },
  {
    accessorKey: 'id',
    cell: (props) => (
      <UserOptions
        userId={props.getValue() as string}
        disabled={currentUserRole !== 'org:admin'}
      />
    ),
    header: '',
    id: 'menu',
    meta: {
      disableSorting: true,
    },
  },
];

export default function AUserList({
  users,
  searchParams,
  currentUserRole,
}: {
  users: UserData[];
  searchParams: SearchParams & { status?: Campaign['status'] };
  currentUserRole: string;
}) {
  const table = useReactTable({
    columns: columns(currentUserRole),
    data: users,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      sorting: [
        {
          id: searchParams?.sort ?? 'createdAt',
          desc: searchParams?.sortDir === 'desc',
        },
      ],
    },
  });

  return (
    <>
      <Header searchParams={searchParams} table={table} />
      <Body data-testid="user-list-body" table={table} />
    </>
  );
}
