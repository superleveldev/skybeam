import AdvertiserSheet from '../../../../../../_components/AdvertiserSheet.server';
import { api } from '../../../../../../../../trpc/server';
import DeleteAdvertiserModal from '../../../../_components/DeleteAdvertiserModal';

export default async function Page({
  params: { advertiserId },
}: {
  params: { advertiserId: string };
}) {
  const advertiser = await api.advertisers.getAdvertiser.query(advertiserId);
  //   TODO: handle not found
  return <DeleteAdvertiserModal advertiserId={advertiserId} />;
}
