import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import {
  cn,
  formatCurrency,
  formatLargeNumber,
} from '@limelight/shared-utils/index';
import { api } from '../../../../trpc/server';
import { InfoIcon } from 'lucide-react';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

// --------------------------------------------------
// Types
// --------------------------------------------------

export interface StatCardProps {
  dimension: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
  tooltip?: string;
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

// --------------------------------------------------
// Container Component
// --------------------------------------------------

export async function StatCardContainer() {
  const statsResponse =
    await api.tinybird.reports.campaignsByOrganization.query();

  const statsData = statsResponse.data[0]; // Access the first item in the data array

  if (!statsData) {
    return null;
  }

  const statCards = [
    {
      dimension: 'Impressions',
      value: formatLargeNumber({
        number: statsData.impressions as number,
      }),
      tooltip:
        'Every time your ad is shown on a TV screen, that’s an impression. Watch your brand grow with every view!',
    },
    {
      dimension: 'Money spent',
      value: currencyFormatter(statsData.spend_usd.toFixed(2) as number),
      tooltip:
        'Keep track of your spend. It’s all about maximizing every dollar for the best return!',
    },
    {
      dimension: 'New campaigns',
      value: statsData.num_campaigns,
      tooltip:
        'Track the number of campaigns you’ve launched. More campaigns mean more opportunities for growth!',
    },
  ];

  return (
    <>
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          dimension={stat.dimension}
          value={stat.value}
          tooltip={stat.tooltip}
          // Optionally set change and isPositive here if needed
        />
      ))}
    </>
  );
}

export default function StatCard(props: StatCardProps) {
  const { dimension, value, change, isPositive, tooltip } = props;
  return (
    <Card className="flex-grow" key={dimension}>
      <CardHeader className="pb-0 px-4 pt-4 space-y-0">
        <CardDescription className="text-foreground font-medium text-base flex gap-2 items-center">
          {dimension}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent align="start">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div
          className={cn('flex gap-1 items-center', {
            'text-green-500': isPositive,
            'text-red-500': !isPositive,
          })}
        >
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <>
      <Card className="flex-grow">
        <CardHeader className="pb-0 px-4 pt-4">
          <div className="text-foreground font-medium text-base flex gap-2 items-center">
            <Skeleton className="w-1/2 h-6" />
          </div>
          <CardTitle className="text-3xl">
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 pt-2">
          <div className="flex gap-1 items-center">
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
      <Card className="flex-grow">
        <CardHeader className="pb-0 px-4 pt-4">
          <div className="text-foreground font-medium text-base flex gap-2 items-center">
            <Skeleton className="w-1/2 h-6" />
          </div>
          <CardTitle className="text-3xl">
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 pt-2">
          <div className="flex gap-1 items-center">
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
      <Card className="flex-grow">
        <CardHeader className="pb-0 px-4 pt-4">
          <div className="text-foreground font-medium text-base flex gap-2 items-center">
            <Skeleton className="w-1/2 h-6" />
          </div>
          <CardTitle className="text-3xl">
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-4 pt-2">
          <div className="flex gap-1 items-center">
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
