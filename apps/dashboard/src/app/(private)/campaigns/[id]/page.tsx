import React, { Suspense } from 'react';
import { api } from '../../../../trpc/server';
import CampaignHeader from './_components/CampaignHeader';
import CampaignSheet from './_components/CampaignSheet';
import {
  PossibleDimensions,
  PossibleReportFields,
  reportFields,
} from '../../../../server/api/routers/tinybird';
import DataTable, {
  DataTableFallback,
} from './_components/reporting/DataTable';
import { Card } from '@limelight/shared-ui-kit/ui/card';
import { z } from 'zod';
import PageHeader from './_components/PageHeader';
import ReportingTabs from './_components/ReportingTabs';
import BarChartCards, {
  BarChartCardsFallback,
} from './_components/BarChartCards';
import TimeSeriesCards, {
  TimeSeriesCardsFallback,
} from './_components/TimeSeriesCards';
import TimeSeriesContainer, {
  TimeSeriesFallBack,
} from './_components/reporting/TimeSeriesContainer';
import { isBefore } from 'date-fns';
import PreFlightNoReport from './_components/PreFlightNoReport';
import DraftNoReport from './_components/DraftNoReport';

export default async function CampaignView({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    metric?: PossibleDimensions;
    startDate?: string;
    endDate?: string;
    tz?: string;
    sort?: string;
    details?: string;
    km?: PossibleReportFields;
  };
}) {
  const { id } = params;
  const campaign = await api.campaigns.getCampaign.query({
    id: id,
  });

  const {
    metric: dimension = 'impression_date',
    startDate = campaign[0]?.startDate.toISOString(),
    endDate = campaign[0]?.endDate.toISOString(),
    tz: timezone = campaign[0]?.timezone?.value,
    sort: _sort,
    km = 'impressions',
    details,
  } = searchParams;

  const sort =
    _sort &&
    z.enum([...reportFields, dimension]).safeParse(_sort.replaceAll('-', ''))
      .success
      ? _sort
      : dimension;

  if (!campaign) {
    <div> No campaign found</div>;
  }

  if (campaign[0].status === 'draft') {
    return (
      <>
        <PageHeader id={id} />
        <main className="flex flex-col items-center justify-center pb-6 h-full">
          <CampaignHeader campaign={campaign[0]} />
          <ReportingTabs id={id} searchParams={searchParams} />
          <div className="w-full px-12 flex gap-4 mb-4">
            <DraftNoReport campaign={campaign[0]} />
          </div>
        </main>
        <CampaignSheet campaign={campaign[0]} />
      </>
    );
  }

  if (isBefore(new Date(), campaign[0].startDate)) {
    return (
      <>
        <PageHeader id={id} />
        <main className="flex flex-col items-center justify-center pb-6 h-full">
          <CampaignHeader campaign={campaign[0]} />
          <ReportingTabs id={id} searchParams={searchParams} />
          <div className="w-full px-12 flex gap-4 mb-4">
            <PreFlightNoReport campaign={campaign[0]} />
          </div>
        </main>
        <CampaignSheet campaign={campaign[0]} />
      </>
    );
  }

  return (
    <>
      <PageHeader id={id} />
      <main className="flex flex-col items-center justify-center pb-6 h-full">
        <CampaignHeader campaign={campaign[0]} />
        <ReportingTabs id={id} searchParams={searchParams} />
        <Suspense
          key={JSON.stringify(searchParams) + 'bar-chart'}
          fallback={<BarChartCardsFallback />}
        >
          <BarChartCards
            id={id}
            startDate={startDate}
            endDate={endDate}
            timezone={timezone}
            dimension={dimension}
            sort={sort}
            campaignName={campaign[0].name}
          />
        </Suspense>
        <div className="w-full px-12 flex gap-4 mb-4">
          <Card className="w-full">
            <Suspense
              key={JSON.stringify(searchParams) + 'time-series-cards'}
              fallback={<TimeSeriesCardsFallback />}
            >
              <TimeSeriesCards
                id={id}
                searchParams={{
                  startDate,
                  endDate,
                  timezone,
                  sort,
                  details,
                  km,
                  metric: dimension,
                }}
              />
            </Suspense>
            <Suspense
              key={JSON.stringify(searchParams) + 'time-series-container'}
              fallback={<TimeSeriesFallBack />}
            >
              <TimeSeriesContainer
                id={id}
                searchParams={{
                  startDate,
                  endDate,
                  timezone,
                  sort,
                  dimension,
                  km,
                }}
              />
            </Suspense>
          </Card>
        </div>
        <Suspense
          key={JSON.stringify(searchParams) + 'data-table'}
          fallback={<DataTableFallback />}
        >
          <div className="w-full px-12 ">
            <DataTable
              id={id}
              startDate={startDate}
              endDate={endDate}
              timezone={timezone}
              sort={sort}
              dimension={dimension}
            />
          </div>
        </Suspense>
      </main>
      <CampaignSheet campaign={campaign[0]} />
    </>
  );
}
