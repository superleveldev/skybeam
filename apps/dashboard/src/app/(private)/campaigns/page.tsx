import { campaignSortSchema, statusEnum } from '@limelight/shared-drizzle';
import CampaignContainer from './_components/CampaignContainer';
import {
  CampaignQueryParams,
  CampaignSort,
  CampaignsProps,
  InfoCardProps,
} from './types';
import Link from 'next/link';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import TableSkeleton from '@limelight/shared-ui-kit/core/Skeleton/Table';
import Search from '@limelight/shared-ui-kit/core/Search';
import InfoCards from './_components/InfoCards';
import { cardsContainerContent } from './data';
import { Suspense } from 'react';
import { StatCardContainer, StatCardSkeleton } from './_components/StatCard';
import { capitalize } from '@limelight/shared-utils/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { ChevronDown } from 'lucide-react';

function getSortBy(_sort: CampaignSort = '-updatedAt'): CampaignQueryParams {
  const sortField = _sort.replace(/^-/, '');
  const validSort = campaignSortSchema.safeParse(sortField);
  const sort = validSort.success ? validSort.data : 'updatedAt';
  const sortDir = _sort.startsWith('-') ? 'desc' : 'asc';
  return { sort, sortDir };
}

export default async function Campaigns({
  searchParams: unformattedParams,
}: CampaignsProps) {
  const {
    limit,
    page,
    search,
    sort: searchParamsSort,
    status,
  } = unformattedParams;
  const { sort, sortDir } = getSortBy(searchParamsSort);
  const searchParams = { limit, page, search, sort, sortDir, status };

  function getNewParams(
    params: typeof unformattedParams,
    newParams: { [key: keyof typeof unformattedParams]: string | undefined },
  ) {
    const entries = Object.entries({ ...params, ...newParams }).filter(
      ([_, val]) => Boolean(val),
    ) as [string, string][];

    return new URLSearchParams(Object.fromEntries(entries));
  }

  return (
    <main className="container grid grid-cols-4 grid-rows-1 gap-4 mx-auto pb-6">
      <div className="col-span-4 md:col-span-3">
        <header className="mb-4 flex w-full max-w-7xl justify-between">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <Link href="/campaigns/new">
            <Button variant="default">Create New Campaign</Button>
          </Link>
        </header>
        <section className="w-full max-w-7xl flex mb-4 justify-between gap-4 flex-wrap">
          <Suspense fallback={<StatCardSkeleton />}>
            <StatCardContainer />
          </Suspense>
        </section>
        <section className="w-full max-w-7xl">
          <div className="mb-4 grid grid-cols-6 grid-rows-1 gap-2">
            <div className="col-span-2 md:col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    data-testid="status-dropdown"
                  >
                    {status ? capitalize(status) : 'Status'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/campaigns?${getNewParams(unformattedParams, {
                        status: undefined,
                      }).toString()}`}
                      className="inline-block"
                    >
                      All
                    </Link>
                  </DropdownMenuItem>
                  {statusEnum.enumValues.map((option) => (
                    <DropdownMenuItem key={`status-filter-${option}`} asChild>
                      <Link
                        href={`/campaigns?${getNewParams(unformattedParams, {
                          status: option,
                        }).toString()}`}
                        className="inline-block"
                      >
                        {capitalize(option)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Search
              className="col-span-4 md:col-span-5"
              searchParams={{ search, sort, sortDir, status }}
            />
          </div>
          <Suspense fallback={<TableSkeleton columns={4} rows={4} />}>
            <CampaignContainer searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
      <div className="col-span-4 md:col-span-1">
        {cardsContainerContent.map((card: InfoCardProps) => (
          <InfoCards
            content={card.content}
            cta={card.cta}
            key={card.title}
            icon={card.icon}
            title={card.title}
            url={card.url}
            isComingSoon={card.isComingSoon}
          />
        ))}
      </div>
    </main>
  );
}
