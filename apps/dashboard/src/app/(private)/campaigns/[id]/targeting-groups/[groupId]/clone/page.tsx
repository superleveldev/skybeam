import SideNav, { SideNavFallback } from '../../../../_components/SideNav';
import { TargetingGroupForm } from '../../_components/TargetingForm';
import { api } from '../../../../../../../trpc/server';
import {
  formatCategories,
  formatCategoriesArray,
  formatLabels,
} from '../../_utils/index';
import { Suspense } from 'react';

export default async function NewTargetingGroup({
  params: { id, groupId },
}: {
  params: { id: string; groupId: string };
}) {
  const [targetingGroup] = await api.targetingGroups.getTargetingGroup.query({
    campaignId: id,
    groupId,
  });
  const [campaign] = await api.campaigns.getCampaign.query({ id });
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
    <main className="grid grid-cols-9 pb-6">
      <Suspense fallback={<SideNavFallback />}>
        <SideNav campaignId={id} step="targeting-groups" />
      </Suspense>
      <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-center justify-center ">
        <div className="w-full h-full">
          <TargetingGroupForm
            advertiserId={campaign.advertiserId}
            ages={ageSegment}
            campaign={campaign}
            categories={categoriesArray}
            genders={genderSegment}
            isClone={true}
            selectedCategories={selectedCategoriesArray}
            selectedLocations={selectedLocations}
            targetingGroup={{
              ...targetingGroup,
              name: `${targetingGroup.name} (Clone)`,
            }}
          />
        </div>
      </section>
    </main>
  );
}
