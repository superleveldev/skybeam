import SideNav, { SideNavFallback } from '../../_components/SideNav';
import { Suspense } from 'react';
import CampaignFormWrapper, {
  CampaignFormWrapperFallback,
} from '../_components/CampaignFormWrapper';

export default async function EditCampaign({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <main className="grid grid-cols-9 pb-6">
      <Suspense fallback={<SideNavFallback />}>
        <SideNav step="setup" campaignId={id} />
      </Suspense>
      <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-center justify-center ">
        <Suspense fallback={<CampaignFormWrapperFallback />}>
          <CampaignFormWrapper campaignId={id} />
        </Suspense>
      </section>
    </main>
  );
}
