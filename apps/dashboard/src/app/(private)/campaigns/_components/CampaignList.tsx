'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { Campaign } from '../types';
import { capitalize, formatCurrency } from '@limelight/shared-utils/index';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import CampaignIndexDropdown from './CampaignIndexDropdown';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'name',
    cell: (props) => (
      <Link href={`/campaigns/${props.row.original.id}`}>
        {capitalize(props.getValue() as string)}
      </Link>
    ),
    header: 'Name',
  },
  {
    accessorKey: 'advertiser.name',
    cell: (props) => capitalize(props.getValue() as string),
    header: 'Advertiser',
    id: 'advertiserId',
  },
  {
    accessorKey: 'status',
    cell: (props) => (
      <StatusBadge status={props.getValue() as Campaign['status']} />
    ),
    header: 'Status',
  },
  {
    accessorFn: (row) => (row.budgetType === 'daily' ? row.budget : null),
    cell: (props) =>
      props.getValue() === null
        ? '-'
        : `${formatCurrency({ number: props.getValue() as number })}`,
    header: 'Daily Budget',
    id: 'dailyBudget',
  },
  {
    accessorFn: (row) => (row.budgetType === 'lifetime' ? row.budget : null),
    cell: (props) =>
      props.getValue() === null
        ? '-'
        : `${formatCurrency({ number: props.getValue() as number })}`,
    header: 'Total Budget',
    id: 'totalBudget',
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
      <CampaignIndexDropdown
        campaignId={props.getValue() as string}
        campaignObjective={props.row.original.objective}
        campaignStatus={props.row.original.status}
      />
    ),
    header: '',
    id: 'menu',
    meta: {
      disableSorting: true,
    },
  },
];

export default function CampaignList({
  campaigns,
  searchParams,
}: {
  campaigns: Campaign[];
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
      <Body data-testid="campaign-list-body" table={table} />
    </>
  );
}
