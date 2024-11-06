import AdvertiserSheetServer from '../../../_components/AdvertiserSheet.server';

export default async function Page({
  params: { advertiserId },
}: {
  params: { advertiserId: string };
}) {
  //   TODO: handle not found
  return <AdvertiserSheetServer advertiserId={advertiserId} />;
}
