import { Table } from '@limelight/shared-ui-kit/core/Table';
import DataList from './DataList';
import { PossibleDimensions } from '../../../../../../server/api/routers/tinybird';

import { api } from '../../../../../../trpc/server';
import TableSkeleton from '@limelight/shared-ui-kit/core/Skeleton/Table';

export default async function DataTable({
  id,
  dimension,
  startDate,
  endDate,
  timezone,
  sort,
}: {
  dimension: PossibleDimensions;
  id: string;
  startDate: string;
  endDate: string;
  timezone: string;
  sort: string;
}) {
  const report = await api.tinybird.reports.campaignByDimension.mutate({
    id,
    dimension: dimension as PossibleDimensions,
    startDate,
    endDate,
    timezone,
    sort,
    limit: 50,
  });

  if (!report?.data?.length) {
    return null;
  }

  return (
    <Table>
      <DataList
        reportData={report}
        dataArray={report.data ?? []}
        dataString={JSON.stringify(report.data)}
      />
    </Table>
  );
}

export function DataTableFallback() {
  return (
    <div className="w-full px-12 ">
      <TableSkeleton columns={6} rows={5} />
    </div>
  );
}
