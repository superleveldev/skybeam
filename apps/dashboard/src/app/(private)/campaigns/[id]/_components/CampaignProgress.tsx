'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { ChartConfig, ChartContainer } from '@limelight/shared-ui-kit/ui/chart';
import { differenceInCalendarDays, isFuture, isPast } from 'date-fns';
import { formatPercentage } from '@limelight/shared-utils/index';

export const description = 'A radial chart with text';

const chartConfig = {
  duration: {
    label: 'Duration',
  },
  progress: {
    label: 'Progress',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function getChartData({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  if (isFuture(startDate)) {
    return [{ duration: 1, progress: 0, fill: 'hsl(var(--chart-2))' }];
  }

  if (isPast(endDate)) {
    return [{ duration: 1, progress: 1, fill: 'hsl(var(--chart-2))' }];
  }
  const progress =
    differenceInCalendarDays(new Date(), startDate) /
    differenceInCalendarDays(endDate, startDate);
  return [{ duration: 1, progress, fill: 'hsl(var(--chart-2))' }];
}

export function CampaignProgress({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const chartData = getChartData({ startDate, endDate });
  return (
    <div className="size-32 flex-shrink-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-16  h-full "
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={360 * chartData[0].progress}
          innerRadius={40}
          outerRadius={55}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[42, 37]}
          />
          <RadialBar dataKey="progress" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-muted-foreground text-2xl font-bold"
                      >
                        {formatPercentage({ number: chartData[0].progress })}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
