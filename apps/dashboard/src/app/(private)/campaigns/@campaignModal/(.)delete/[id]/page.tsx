import DeleteCampaignModal from '../../../_components/DeleteModal';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return <DeleteCampaignModal campaignId={id} />;
}
