import { Button } from '@limelight/shared-ui-kit/ui/button';
import { api } from '../../../../../trpc/server';

export default async function Page({
  params: { advertiserId },
}: {
  params: { advertiserId: string };
}) {
  const advertiser = await api.advertisers.getAdvertiser.query(advertiserId);

  //   TODO: handle not found

  return (
    <main className="grid grid-cols-9 pb-6">
      <section className="col-span-9 lg:col-span-5 lg:col-start-3 flex w-full flex-1 flex-col items-center justify-center ">
        <header className="max-w-2xl px-8">
          <h2 className="mb-0.5 text-lg font-medium">Delete Advertiser</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Are you sure? This action cannot be undone. This will permanently
            delete the advertiser and all associated campaigns.
          </p>
        </header>
        <div className="flex w-full justify-between max-w-2xl px-8 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Advertiser</Button>
        </div>
      </section>
    </main>
  );
}
