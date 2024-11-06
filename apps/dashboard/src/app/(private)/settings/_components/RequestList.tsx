'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import { useOrganization } from '@clerk/nextjs';
import RequestOptions from './RequestOptions';

type RequestData = {
  id: string;
  name?: string;
  createdAt: Date;
  status: string;
  email?: string;
  reject: () => void;
  approve: () => void;
};

export const columns: ColumnDef<RequestData>[] = [
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
    accessorKey: 'createdAt',
    cell: (props) => new Date(props.getValue() as number).toDateString(),
    header: 'Created On',
  },
  {
    accessorKey: 'status',
    cell: (props) => props.getValue() || '-',
    header: 'Status',
  },
  {
    accessorKey: 'id',
    cell: (props) => <RequestOptions requestId={props.getValue() as string} />,
    header: '',
    id: 'menu',
    meta: {
      disableSorting: true,
    },
  },
];

const MembershipRequestsParams = {
  membershipRequests: {
    pageSize: 10,
    keepPreviousData: true,
  },
};

export default function InviteList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // TODO: replace with organization route for accept/reject and listing

  const { isLoaded, membershipRequests } = useOrganization(
    MembershipRequestsParams,
  );

  const requests: RequestData[] = (membershipRequests?.data ?? []).map(
    (request) => ({
      id: request.id,
      name: [
        request.publicUserData?.firstName,
        request.publicUserData?.lastName,
      ]
        .filter(Boolean)
        .join(' '),
      email: request.publicUserData.identifier,
      createdAt: request.createdAt,
      status: request.status,
      reject: request.reject,
      approve: request.accept,
    }),
  );

  const table = useReactTable({
    columns,
    data: requests,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Header searchParams={searchParams} table={table} sortable={false} />
      <Body data-testid="invite-list-body" table={table} />
    </>
  );
}
