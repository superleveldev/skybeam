import CampaignList from './CampaignList';
import { Table } from '@limelight/shared-ui-kit/core/Table';
import { Campaign, CampaignQueryParams } from '../types';
import { api } from '../../../../trpc/server';
import Pagination from '@limelight/shared-ui-kit/core/Pagination';

export default async function CampaignContainer({
  searchParams,
}: {
  searchParams: CampaignQueryParams;
}) {
  const { search, sort, sortDir, status } = searchParams;
  const { data, meta }: { data: Campaign[]; meta: { count: number } } =
    await api.campaigns.getCampaigns.query(searchParams);

  const { count } = meta;
  return (
    <>
      <div className="bg-white col-span-1">
        <Table>
          <CampaignList
            campaigns={data}
            searchParams={{ search, sort, sortDir, status }}
          />
        </Table>
      </div>
      <Pagination className="mt-4" searchParams={searchParams} total={count} />
    </>
  );
}
