'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { CardContent } from '@limelight/shared-ui-kit/ui/card';
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
import {
  PossibleDimensions,
  PossibleReportFields,
} from '../../../../../../server/api/routers/tinybird';

export function TimeSeries<
  T extends PossibleDimensions,
  D extends PossibleDimensions,
>({
  dimension,
  valueKey,
  keyMetric,
  lineNames,
  lines,
}: {
  dimension: D;
  valueKey: T;
  keyMetric: PossibleReportFields;
  lines: any;
  lineNames: string[];
}) {
  const chartConfig = {
    [keyMetric]: {
      label: 'Desktop',
      color: 'var(--blue-500)',
    },
  } satisfies ChartConfig;

  let valFormatter = (val: any) => val;

  if (new Set(['impressions', 'reach']).has(keyMetric)) {
    valFormatter = (val: any) =>
      formatLargeNumber({
        number: val as number,
      });
  }

  if (new Set(['cpm', 'cpr', 'spend_usd']).has(keyMetric)) {
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
  return (
    <>
      <CardContent className="h-full pt-4">
        <ChartContainer config={chartConfig} className="min-h-full h-full">
          <LineChart
            accessibilityLayer
            data={lines}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              dataKey={keyMetric}
              axisLine={false}
              tickFormatter={valFormatter}
              tickLine={false}
            />
            <XAxis
              dataKey="impression_date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(val: any) =>
                formatInTimeZone(new Date(val), 'UTC', 'MMM d')
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(val, name) => name + ' : ' + valFormatter(val)}
            />
            {lineNames.map((line, idx) => (
              <Line
                key={line}
                dataKey={valueKey === 'impression_date' ? keyMetric : line}
                type="monotone"
                stroke={`var(--line${idx})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
