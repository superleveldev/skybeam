import { redirect } from 'next/navigation';
import { api } from '../../../../../../trpc/server';
import {
  formatCategories,
  formatCategoriesArray,
  formatLabels,
} from '../_utils';
import { TargetingGroupForm } from './TargetingForm';
import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

export default async function TargetingGroupFormWrapper({
  groupId,
  campaignId,
}: {
  groupId: string;
  campaignId: string;
}) {
  const [campaign] = await api.campaigns.getCampaign.query({ id: campaignId });

  if (
    campaign?.status === 'published' &&
    campaign.objective === 'retargeting'
  ) {
    redirect('/campaigns');
  }
  const [targetingGroup] = await api.targetingGroups.getTargetingGroup.query({
    campaignId,
    groupId,
  });

  const fetchedCategories = await api.tinybird.targetingSegments.all.query({});
  const ageSegment = await api.tinybird.targetingSegments.all.query({
    classification: 'Age',
  });
  const genderSegment = await api.tinybird.targetingSegments.all.query({
    classification: 'Gender',
  });
  const selectedLocationsUnformatted = targetingGroup.geoCities.length
    ? await api.tinybird.geoTargetings.all.query({
        geonames: targetingGroup.geoCities.join(','),
      })
    : [];
  const selectedLocations = selectedLocationsUnformatted.map((location) => ({
    label: formatLabels(location),
    value: location.geoname,
  }));
  const selectedCategories = fetchedCategories.filter((category) =>
    targetingGroup.categories.includes(category.attribute_uuid),
  );
  const categoriesArray = formatCategoriesArray(fetchedCategories);
  const selectedCategoriesArray = formatCategories(selectedCategories);

  return (
    <TargetingGroupForm
      advertiserId={campaign.advertiserId}
      ages={ageSegment}
      campaign={campaign}
      categories={categoriesArray}
      genders={genderSegment}
      selectedCategories={selectedCategoriesArray}
      selectedLocations={selectedLocations}
      targetingGroup={targetingGroup}
    />
  );
}

export function TargetingGroupFormWrapperFallback() {
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
