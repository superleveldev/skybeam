'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { Campaign } from '../../campaigns/types';
import { capitalize } from '@limelight/shared-utils/index';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import { Advertiser } from '@limelight/shared-drizzle';
import AdvertiserOptions from './AdvertiserOptions';

export const columns: ColumnDef<Advertiser>[] = [
  {
    accessorKey: 'name',
    cell: (props) => capitalize(props.getValue() as string),
    header: 'Name',
  },
  {
    accessorKey: 'website',
    cell: (props) => (
      <a href={props.getValue() as string} target="_blank">
        {props.getValue() as string}
      </a>
    ),
    header: 'Website',
  },
  {
    accessorKey: 'industry',
    cell: (props) => capitalize(props.getValue() as string),
    header: 'Industry',
  },
  {
    accessorKey: 'updatedAt',
    cell: (props) => {
      const date = props.getValue() as Date;
      return date.toDateString();
    },
    header: 'Last Modified On',
  },
  {
    accessorKey: 'id',
    cell: (props) => (
      <AdvertiserOptions advertiserId={props.getValue() as string} />
    ),
    header: '',
    id: 'menu',
    meta: {
      disableSorting: true,
    },
  },
];

export default function AdvertiserList({
  advertisers: campaigns,
  searchParams,
}: {
  advertisers: Advertiser[];
  searchParams: SearchParams & { status?: Campaign['status'] };
}) {
  const table = useReactTable({
    columns,
    data: campaigns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      sorting: [
        {
          id: searchParams?.sort ?? 'updatedAt',
          desc: searchParams?.sortDir === 'desc',
        },
      ],
    },
  });

  return (
    <>
      <Header searchParams={searchParams} table={table} />
      <Body data-testid="advertiser-list-body" table={table} />
    </>
  );
}
