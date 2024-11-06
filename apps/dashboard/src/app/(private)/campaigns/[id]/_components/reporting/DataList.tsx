'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Header, Body } from '@limelight/shared-ui-kit/core/Table';
import { useSearchParams } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import {
  formatCurrency,
  formatLargeNumber,
  spaceCase,
  titleCase,
} from '@limelight/shared-utils/index';
import { SearchParams } from '@limelight/shared-ui-kit/core/types';
import {
  PossibleDimensions,
  ReportingData,
} from '../../../../../../server/api/routers/tinybird/types/campaignReportTypes';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function DataList<T extends PossibleDimensions>({
  reportData,
  dataArray,
  dataString,
}: {
  reportData: ReportingData<T>;
  dataArray: ReportingData<T>['data'];
  dataString: string;
}) {
  const searchParams = useSearchParams();

  const columns: ColumnDef<ReportingData<T>['data'][number]>[] =
    reportData.meta.map((column: { name: string; type: string }) => {
      const accessorKey = column.name;

      let cellRenderer: (props: any) => JSX.Element | string | number = (
        props,
      ) => props.getValue();

      switch (column.type) {
        case 'Date':
          cellRenderer = (props) =>
            formatInTimeZone(new Date(props.getValue()), 'UTC', 'PP');
          break;
        case 'UInt64':
          cellRenderer = (props) =>
            formatLargeNumber({ number: props.getValue() as number });
          break;
        case 'Float64':
          cellRenderer = (props) =>
            formatCurrency({
              number: props.getValue() as number,
              options: {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'USD',
              },
            });
          break;
        case 'String':
          cellRenderer = (props) => (
            <span className="font-bold">{props.getValue()}</span>
          );
          break;
        default:
          break;
      }

      return {
        accessorKey,
        cell: cellRenderer,
        header: titleCase(spaceCase(column.name)),
      };
    });

  const data = useMemo(
    () => JSON.parse(dataString) as typeof dataArray,
    [dataString],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      sorting: [
        {
          id:
            searchParams?.get('sort')?.replaceAll('-', '') ?? 'impression_date',
          desc: searchParams.get('sort')?.startsWith('-') ?? false,
        },
      ],
    },
  });

  const nextSearchParams: SearchParams = {};
  searchParams.forEach((value, key) => {
    nextSearchParams[key] = value;
  });

  return (
    <>
      <Header searchParams={nextSearchParams} table={table} />
      <Body data-testid="advertiser-list-body" table={table} />
    </>
  );
}
