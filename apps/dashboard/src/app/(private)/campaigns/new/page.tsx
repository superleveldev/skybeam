import { Suspense } from 'react';
import CampaignForm from '../_components/CampaignForm';
import SideNav, { SideNavFallback } from '../_components/SideNav';

export default function NewCampaign() {
  return (
    <main className="grid grid-cols-9 pb-6">
      <Suspense fallback={<SideNavFallback />}>
        <SideNav step="setup" />
      </Suspense>
      <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-center justify-center ">
        <CampaignForm />
      </section>
    </main>
  );
}
