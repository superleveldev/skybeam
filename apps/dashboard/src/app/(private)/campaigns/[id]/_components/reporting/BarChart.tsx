'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@limelight/shared-ui-kit/ui/chart';
import { formatInTimeZone } from 'date-fns-tz';
import {
  formatCurrency,
  formatLargeNumber,
} from '@limelight/shared-utils/index';
import { ReactNode } from 'react';
import {
  PossibleDimensions,
  PossibleReportFields,
  ReportingData,
} from '../../../../../../server/api/routers/tinybird';

export const description = 'A bar chart';

const NO_DATA_VIZ = new Set('impression_date');

export function BarChartCard<T extends PossibleDimensions>({
  report,
  cardName,
  dimension,
  keyMetric,
  description,
  direction,
  endIndex,
  icon,
  frequency,
}: {
  cardName: string;
  report: ReportingData<T>;
  dimension: PossibleReportFields;
  keyMetric: T;
  description: string;
  direction: 'asc' | 'desc';
  endIndex: number;
  icon: ReactNode;
  frequency?: string;
}) {
  const _chartData = NO_DATA_VIZ.has(keyMetric)
    ? undefined
    : report.data
        .sort((a: any, b: any) => {
          const first = direction === 'asc' ? a : b;
          const second = direction === 'asc' ? b : a;

          // Function to parse the value and convert to a number (int or float)
          const parseValue = (value: any) => {
            const stringValue = String(value).trim();
            // Handle cases with '+' or other non-numeric characters
            const cleanValue = stringValue.replace(/[^\d.-]/g, '');
            return parseFloat(cleanValue) || 0; // Return 0 if parsing fails
          };

          const sortKey =
            cardName === 'frequency_bucket' ? keyMetric : dimension;
          return parseValue(first[sortKey]) - parseValue(second[sortKey]);
        })
        .slice(0, endIndex);

  const TOP = _chartData
    ? Math.max(..._chartData.map((data) => +data[dimension]))
    : 0;

  const chartData = _chartData?.map((data: any) => ({
    ...data,
    top: TOP * 0.05,
  }));

  const metaType = report.meta.find((meta) => meta.name === keyMetric)?.type;

  let valFormatter = (val: any) => val;
  let dimensionFormatter = (val: any) => val;
  if (metaType === 'Date') {
    dimensionFormatter = (val: any) =>
      formatInTimeZone(new Date(val), 'UTC', 'PP');
  }

  if (new Set(['cpm ']).has(dimension)) {
    dimensionFormatter = (val: any) =>
      formatCurrency({
        number: val as number,
        options: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'USD',
        },
      });
  }

  if (new Set(['impressions', 'reach']).has(dimension)) {
    valFormatter = (val: any) =>
      formatLargeNumber({
        number: val as number,
      });
  }

  if (new Set(['cpm', 'cpr', 'spend_usd']).has(dimension)) {
    valFormatter = (val: any) =>
      formatCurrency({
        number: val as number,
        options: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'USD',
        },
      });
  }

  const chartConfig = {
    [dimension]: {
      label: keyMetric,
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <>
      <CardHeader className="p-4">
        <CardTitle className="text-xl pb-0 pt-0 flex gap-2 items-center">
          {icon}
          <CardDescription className="my-0 py-0">{description}</CardDescription>
        </CardTitle>
        {frequency === undefined || frequency === null || frequency === ''
          ? chartData
            ? dimensionFormatter(chartData[0][keyMetric])
            : '-'
          : frequency}
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="min-h-[130px] h-[130px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={keyMetric}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(val) =>
                val
                  ? dimensionFormatter(`${val}`)?.slice(0, 10) +
                    (dimensionFormatter(`${val}`)?.length > 10 ? '...' : '')
                  : ''
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) =>
                    name === 'top' ? null : (
                      <div className="">
                        <span>{valFormatter(+value)}</span>
                      </div>
                    )
                  }
                />
              }
            />
            <Bar
              stackId="a"
              dataKey={dimension}
              fill={`var(--color-${dimension})`}
              radius={0}
              strokeWidth={3}
            />
            <Bar stackId="a" dataKey={'top'} fill="#0056ED" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
