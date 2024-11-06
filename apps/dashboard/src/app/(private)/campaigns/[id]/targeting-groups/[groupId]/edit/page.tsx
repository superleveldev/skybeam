import { Suspense } from 'react';
import SideNav, { SideNavFallback } from '../../../../_components/SideNav';
import TargetingGroupFormWrapper, {
  TargetingGroupFormWrapperFallback,
} from '../../_components/TargetingGroupFormWrapper';

export default async function EditTargetingGroup({
  params: { id, groupId },
}: {
  params: { id: string; groupId: string };
}) {
  return (
    <main className="grid grid-cols-9 pb-6">
      <Suspense fallback={<SideNavFallback />}>
        <SideNav
          campaignId={id}
          targetingGroupId={groupId}
          step="targeting-groups"
        />
      </Suspense>
      <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-center justify-center ">
        <div className="w-full h-full">
          <Suspense fallback={<TargetingGroupFormWrapperFallback />}>
            <TargetingGroupFormWrapper campaignId={id} groupId={groupId} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
