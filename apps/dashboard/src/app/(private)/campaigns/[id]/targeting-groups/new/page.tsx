import SideNav, { SideNavFallback } from '../../../_components/SideNav';
import { Suspense } from 'react';
import { TargetingGroupFormWrapperFallback } from '../_components/TargetingGroupFormWrapper';
import NewTargetingGroupFormWrapper from '../_components/NewTargetingGroupFormWrapper';

export default async function NewTargetingGroup({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <main className="grid grid-cols-9 pb-6">
      <Suspense fallback={<SideNavFallback />}>
        <SideNav campaignId={id} step="targeting-groups" />
      </Suspense>
      <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-center justify-center">
        <div className="w-full h-full">
          <Suspense fallback={<TargetingGroupFormWrapperFallback />}>
            <NewTargetingGroupFormWrapper campaignId={id} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
