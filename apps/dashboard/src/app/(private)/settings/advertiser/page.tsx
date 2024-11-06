import { Table } from '@limelight/shared-ui-kit/core/Table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import { api } from '../../../../trpc/server';
import AdvertiserList from '../_components/AdvertiserList';
import Pagination from '@limelight/shared-ui-kit/core/Pagination';
import { Advertiser, selectAdvertiserSchema } from '@limelight/shared-drizzle';
import Link from 'next/link';

type AdvertiserQueryParams = Parameters<
  typeof api.advertisers.getAdvertisers.query
>[0];
type AdvertiserFields = keyof typeof selectAdvertiserSchema.shape;
type AdvertiserSort = `${AdvertiserFields}` | `-${AdvertiserFields}`;

function getSortBy(
  _sort: AdvertiserSort = '-updatedAt',
): AdvertiserQueryParams {
  const sortField = _sort.replace(/^-/, '');
  const validSort = selectAdvertiserSchema.keyof().safeParse(sortField);
  const sort = validSort.success ? validSort.data : 'updatedAt';
  const sortDir = _sort.startsWith('-') ? 'desc' : 'asc';
  return { sort, sortDir };
}

export default async function AdvertiserSettingsPage({
  searchParams,
}: {
  searchParams: { sort: AdvertiserSort; page: string };
}) {
  const { sort, sortDir } = getSortBy(searchParams.sort);
  const { data, meta }: { data: Advertiser[]; meta: { count: number } } =
    await api.advertisers.getAdvertisers.query({
      sort,
      sortDir,
      limit: '10',
      page: searchParams.page ?? '1',
    });

  const { count } = meta;

  return (
    <Card className="flex-grow col-span-4">
      <CardHeader className="pb-0 px-4 py-4 space-y-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl inline-block w-fit">
          Advertisers
        </CardTitle>
        <Link
          href="/advertisers/new"
          className="w-fit inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
        >
          New Advertiser
        </Link>
      </CardHeader>
      <CardContent className="pb-4 px-0">
        <Table>
          <AdvertiserList advertisers={data} searchParams={{ sort, sortDir }} />
        </Table>
        <Pagination
          className="mt-4"
          searchParams={searchParams}
          total={count}
        />
      </CardContent>
    </Card>
  );
}
