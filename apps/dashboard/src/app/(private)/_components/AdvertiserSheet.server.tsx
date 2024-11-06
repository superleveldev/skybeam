import { SheetHeader, SheetTitle } from '@limelight/shared-ui-kit/ui/sheet';
import AdvertiserForm from './AdvertiserForm';
import { api } from '../../../trpc/server';
import { AdvertiserSheetClient } from './AdvertiserSheet.client';
import { Suspense } from 'react';

export default async function AdvertiserSheetServer({
  advertiserId,
}: {
  advertiserId?: string;
}) {
  return (
    <AdvertiserSheetClient>
      <Suspense fallback={<div>Loading...</div>}>
        <TheContent advertiserId={advertiserId} />
      </Suspense>
    </AdvertiserSheetClient>
  );
}

const TheContent = async ({ advertiserId }: { advertiserId?: string }) => {
  const advertiser = advertiserId
    ? await api.advertisers.getAdvertiser.query(advertiserId)
    : undefined;

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle className="px-6 mb-6">
          {advertiser ? 'Edit' : 'Add'} Advertiser
        </SheetTitle>
      </SheetHeader>
      <div className="mt-6 pt-6 px-6">
        <AdvertiserForm
          advertiser={advertiser}
          redirectUrl="/settings/advertiser"
        />
      </div>
    </>
  );
};
