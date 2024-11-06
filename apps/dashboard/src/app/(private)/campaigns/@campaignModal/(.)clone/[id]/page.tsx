import CloneModal from '../../../_components/CloneModal';
import { Suspense } from 'react';
import CloneFormWrapper, {
  CloneFormWrapperFallback,
} from '../../../_components/CloneFormWrapper';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <CloneModal>
      <div className="grid gap-4 py-4">
        <Suspense fallback={<CloneFormWrapperFallback />}>
          <CloneFormWrapper campaignId={id} />
        </Suspense>
      </div>
    </CloneModal>
  );
}
