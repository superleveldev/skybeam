import {
  Card,
  CardContent,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
import { BarChartCard } from './reporting/BarChart';
import { CircleDollarSign, Eye, RefreshCcw } from 'lucide-react';
import { PossibleDimensions } from '../../../../../server/api/routers/tinybird';
import { api } from '../../../../../trpc/server';
import { getFrequencyAverages } from '../../../../../server/queries';
import { ComponentProps } from 'react';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';
import PreparingDataNoReport from './PreparingDataNoReport';

export default async function BarChartCards({
  dimension,
  id,
  startDate,
  endDate,
  timezone,
  sort,
  campaignName,
}: {
  dimension: PossibleDimensions;
  id: string;
  startDate: string;
  endDate: string;
  timezone: string;
  sort: string;
  campaignName: string;
}) {
  const report = await api.tinybird.reports.campaignByDimension.mutate({
    id,
    dimension: dimension as PossibleDimensions,
    startDate,
    endDate,
    timezone,
    sort,
  });

  const { averageFrequency, frequencyBuckets } = await getFrequencyAverages({
    id,
    startDate,
    endDate,
    timezone,
  });

  if (!report?.data?.length || !frequencyBuckets?.data?.length) {
    return <PreparingDataNoReport campaignName={campaignName} />;
  }

  const CHART_DATA: ComponentProps<typeof BarChartCard>[] = [
    {
      report: report,
      cardName: 'impressions',
      dimension: 'impressions',
      keyMetric: dimension,
      description: 'Most Impressions Delivered',
      direction: 'desc',
      endIndex: 5,
      icon: <Eye className="size-6 font-normal text-gray-300" />,
    },
    {
      report: report,
      cardName: 'cpm',
      dimension: 'cpm',
      keyMetric: dimension,
      description: 'Lowest Cost-per-mille (CPM)',
      direction: 'asc',
      endIndex: 5,
      icon: <CircleDollarSign className="size-6 font-normal text-gray-300" />,
    },
    {
      report: frequencyBuckets,
      cardName: 'frequency_bucket',
      dimension: 'reach',
      keyMetric: 'frequency_bucket',
      description: 'Average Frequency',
      direction: 'asc',
      endIndex: 10,
      icon: <RefreshCcw className="size-6 font-normal text-gray-300" />,
      frequency: averageFrequency.toFixed(2),
    },
  ];

  return (
    <div className="w-full px-12 flex justify-between mb-4 flex-wrap">
      {CHART_DATA.map((props) => (
        <Card
          className="w-full md:w-[32%] h-56"
          key={`${props.dimension}-barChart`}
        >
          <BarChartCard {...props} />
        </Card>
      ))}
    </div>
  );
}

export function BarChartCardsFallback() {
  return (
    <div className="w-full px-12 flex gap-4 mb-4 flex-wrap">
      <Card className="w-full md:w-[32%] h-56">
        <CardHeader className="p-4">
          <Skeleton className="h-8 text-xl pb-0 pt-0 flex gap-2 items-center  " />
          <Skeleton className="my-0 py-0" />
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="w-full min-h-[130px] h-[130px]" />
        </CardContent>
      </Card>
      <Card className="w-full md:w-[32%] h-56">
        <CardHeader className="p-4">
          <Skeleton className="h-8 text-xl pb-0 pt-0 flex gap-2 items-center  " />
          <Skeleton className="my-0 py-0" />
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="w-full min-h-[130px] h-[130px]" />
        </CardContent>
      </Card>
      <Card className="w-full md:w-[32%] h-56">
        <CardHeader className="p-4">
          <Skeleton className="h-8 text-xl pb-0 pt-0 flex gap-2 items-center  " />
          <Skeleton className="my-0 py-0" />
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="w-full min-h-[130px] h-[130px]" />
        </CardContent>
      </Card>
    </div>
  );
}
