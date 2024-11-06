import DeleteCampaign from '../../_components/DeleteCampaign';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <main className="grid grid-cols-9 pb-6">
      <DeleteCampaign id={id} />
    </main>
  );
}
