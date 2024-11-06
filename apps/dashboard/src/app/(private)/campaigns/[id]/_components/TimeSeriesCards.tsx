import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import Link from 'next/link';
import { MetricCardContent } from './reporting/MetricCard';
import {
  cn,
  formatCurrency,
  formatLargeNumber,
} from '@limelight/shared-utils/index';
import { api } from '../../../../../trpc/server';
import { PossibleReportFields } from '../../../../../server/api/routers/tinybird';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

export default async function TimeSeriesCards({
  id,
  searchParams,
}: {
  id: string;
  searchParams: {
    startDate?: string;
    endDate?: string;
    timezone?: string;
    sort?: string;
    details?: string;
    km?: PossibleReportFields;
    metric?: string;
  };
}) {
  const { startDate, endDate, timezone, km } = searchParams;

  const campaignAggregates =
    await api.tinybird.reports.campaignByDimension.mutate({
      id,
      dimension: 'campaign_id',
      startDate,
      endDate,
      timezone,
    });

  if (!campaignAggregates?.data?.length) {
    return null;
  }

  const CARD_DATA = [
    {
      km: 'impressions',
      value: formatLargeNumber({
        number: campaignAggregates.data[0].impressions as number,
      }),
      label: 'Impressions',
      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: 'rounded-b-none md:rounded-e-none',
    },
    {
      km: 'cpm',
      value: currencyFormatter(campaignAggregates.data[0].cpm as number),
      label: 'Cost-per-mille (CPM)',
      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius:
        'rounded-b-none rounded-t-none md:rounded-tr-md lg:rounded-t-none',
    },
    {
      km: 'reach',
      value: formatLargeNumber({
        number: campaignAggregates.data[0].reach as number,
      }),
      label: 'Reach',
      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: ' rounded-b-none rounded-t-none',
    },
    {
      km: 'spend_usd',
      value: currencyFormatter(campaignAggregates.data[0].spend_usd as number),
      label: 'Spend',
      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: 'rounded-b-none rounded-t-none',
    },
    {
      km: 'cpr',
      value: currencyFormatter(campaignAggregates.data[0].cpr as number),
      label: 'Cost-per-reach (CPR)',
      classNames: 'w-full lg:w-1/5',
      radius: 'rounded-b-none rounded-t-none lg:rounded-tr-md',
    },
  ];

  return (
    <>
      <div className="w-full flex flex-wrap">
        {CARD_DATA.map((card) => {
          const nextParams = getNewParams(new URLSearchParams(searchParams), {
            km: card.km,
          }).toString();
          return (
            <Link
              key={`${card.km}--ts-card`}
              href={`/campaigns/${id}?${nextParams}`}
              className={card.classNames}
            >
              <Card
                className={cn('w-full pb-4', card.radius, {
                  'bg-blue-100': km === card.km,
                  'text-blue-600': km === card.km,
                })}
              >
                <MetricCardContent value={card.value} label={card.label} />
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getNewParams(
  params: URLSearchParams,
  newParams: Record<string, string>,
) {
  const newSearchParams = new URLSearchParams(params.toString());
  for (const [key, value] of Object.entries(newParams)) {
    newSearchParams.set(key, value);
  }
  return newSearchParams;
}

function currencyFormatter(number: number) {
  return formatCurrency({
    number: number,
    options: {
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'currency',
    },
  });
}

export function TimeSeriesCardsFallback() {
  const CARD_DATA = [
    {
      km: 'impressions',

      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: 'rounded-b-none md:rounded-e-none',
    },
    {
      km: 'cpm',

      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius:
        'rounded-b-none rounded-t-none md:rounded-tr-md lg:rounded-t-none',
    },
    {
      km: 'reach',

      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: ' rounded-b-none rounded-t-none',
    },
    {
      km: 'spend_usd',

      classNames: 'w-full md:w-1/2 lg:w-1/5',
      radius: 'rounded-b-none rounded-t-none',
    },
    {
      km: 'cpr',

      classNames: 'w-full lg:w-1/5',
      radius: 'rounded-b-none rounded-t-none lg:rounded-tr-md',
    },
  ];
  return (
    <div className="w-full flex flex-wrap h-[77px]">
      {CARD_DATA.map((card) => {
        return (
          <Card
            key={`${card.km}--ts-card-fb`}
            className={cn('w-full pb-4 h-full', card.radius, card.classNames)}
          >
            <CardHeader className="p-4 pb-1 h-1/5">
              <CardTitle className="text-base pb-0 pt-0 flex gap-2 items-center  ">
                <Skeleton className="w-full h-full" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-4/5 text-2xl font-bold py-0 px-4">
              <Skeleton className="w-full h-full" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
