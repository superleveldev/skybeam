import { getLines } from '../../../../../../server/queries';
import {
  PossibleDimensions,
  PossibleReportFields,
} from '../../../../../../server/api/routers/tinybird';
import { TimeSeries } from './TimeSeries';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

export default async function TimeSeriesContainer<
  T extends PossibleDimensions,
  D extends PossibleReportFields,
>({
  id,
  searchParams,
}: {
  id: string;
  searchParams: {
    startDate: string;
    endDate: string;
    timezone: string;
    sort: string;
    dimension: PossibleDimensions;
    km: PossibleReportFields;
  };
}) {
  const { startDate, endDate, timezone, dimension, km } = searchParams;

  const { lines, lineNames } = await getLines({
    id,
    additionalDimensions: dimension,
    startDate,
    endDate,
    km,
    timezone,
  });

  if (!lines?.length || !lineNames?.length) {
    return null;
  }

  return (
    <div className="h-96">
      <TimeSeries
        dimension="impression_date"
        valueKey={dimension}
        keyMetric={km}
        lines={lines}
        lineNames={lineNames}
      />
    </div>
  );
}

export function TimeSeriesFallBack() {
  return (
    <div className="h-96 p-4">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
