import { api } from '../../../../../../trpc/server';
import { formatCategoriesArray } from '../_utils';
import { TargetingGroupForm } from './TargetingForm';

export default async function NewTargetingGroupFormWrapper({
  campaignId,
}: {
  campaignId: string;
}) {
  const [campaign] = await api.campaigns.getCampaign.query({ id: campaignId });

  const fetchedCategories = await api.tinybird.targetingSegments.all.query({});
  const ageSegment = await api.tinybird.targetingSegments.all.query({
    classification: 'Age',
  });
  const genderSegment = await api.tinybird.targetingSegments.all.query({
    classification: 'Gender',
  });
  const categoriesArray = formatCategoriesArray(fetchedCategories);
  return (
    <TargetingGroupForm
      advertiserId={campaign.advertiserId}
      ages={ageSegment}
      campaign={campaign}
      categories={categoriesArray}
      genders={genderSegment}
    />
  );
}
