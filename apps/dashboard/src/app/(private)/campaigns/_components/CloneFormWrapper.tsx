import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { api } from '../../../../trpc/server';
import CloneFormContainer from './CloneForm';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';
export default async function CloneFormWrapper({
  campaignId,
}: {
  campaignId: string;
}) {
  const [campaign] = await api.campaigns.getCampaign.query({
    id: campaignId,
  });

  return (
    <CloneFormContainer
      campaign={{
        ...campaign,
        name: `${campaign.name}(copy)`,
        startDate: new Date(),
        endDate: new Date(),
      }}
    />
  );
}

export function CloneFormWrapperFallback() {
  return (
    <div className="w-full space-y-8">
      <Card className="p-6">
        <CardContent className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
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
