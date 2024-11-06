import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { api } from '../../../../../trpc/server';
import CampaignFormContainer from '../../_components/CampaignForm';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

export default async function CampaignFormWrapper({
  campaignId,
}: {
  campaignId: string;
}) {
  const [campaign] = await api.campaigns.getCampaign.query({
    id: campaignId,
  });

  return <CampaignFormContainer campaign={campaign} />;
}

export function CampaignFormWrapperFallback() {
  return (
    <div className="w-full space-y-8">
      <Card className="p-6">
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex w-full flex-wrap justify-center gap-4">
            <Skeleton className="h-20 w-full md:w-[45%]" />
            <Skeleton className="h-20 w-full md:w-[45%]" />
          </div>
          <div className="flex w-full flex-wrap justify-center gap-4">
            <Skeleton className="h-20 w-full md:w-[45%]" />
            <Skeleton className="h-20 w-full md:w-[45%]" />
          </div>
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex w-full flex-wrap justify-center gap-4">
            <Skeleton className="h-20 w-full md:w-1/2" />
            <Skeleton className="h-20 w-full md:w-1/2" />
          </div>
          <Skeleton className="h-6 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
