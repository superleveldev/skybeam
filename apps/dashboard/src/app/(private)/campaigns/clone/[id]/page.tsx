import { Suspense } from 'react';
import CloneFormWrapper, {
  CloneFormWrapperFallback,
} from '../../_components/CloneFormWrapper';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <main className="grid grid-cols-9 pb-6">
      <section className="col-span-9 lg:col-span-5 lg:col-start-3 flex w-full flex-1 flex-col items-center justify-center ">
        <header className="max-w-2xl px-10 w-full">
          <h2 className="mb-0.5 text-lg font-medium">Duplicate Campaign</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Duplicate this campaign to create a new one.
          </p>
        </header>
        <Suspense fallback={<CloneFormWrapperFallback />}>
          <CloneFormWrapper campaignId={id} />
        </Suspense>
      </section>
    </main>
  );
}
