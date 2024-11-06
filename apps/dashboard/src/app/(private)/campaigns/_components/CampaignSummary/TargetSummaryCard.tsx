import { FormTargetingGroup } from '@limelight/shared-drizzle';
import { api } from '../../../../../trpc/server';
import { CardContent } from '@limelight/shared-ui-kit/ui/card';
import { Separator } from '@limelight/shared-ui-kit/ui/separator';
import { TargetingSegment } from '../../../../../server/api/routers/tinybird/targeting-segments';
import { formatLabels } from '../../[id]/targeting-groups/_utils';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import { fetchInventories } from '../../[id]/targeting-groups/_utils/actions';
import {
  capitalize,
  formatCurrency,
  formatMilliseconds,
} from '@limelight/shared-utils/index';
import { getTargetingGroupCreative } from '../../../../../server/actions';
import ShowAllButton from './ShowAllButton';
import { FileVideo } from 'lucide-react';

export default async function TargetSummaryCard({
  allCategories,
  targetingGroup,
}: {
  allCategories: { [key: string]: TargetingSegment[] };
  targetingGroup: FormTargetingGroup;
}) {
  const locations = targetingGroup.geoCities?.length
    ? await api.tinybird.geoTargetings.all.query({
        geonames: targetingGroup.geoCities?.join(','),
      })
    : [];

  const inventories = await fetchInventories();
  const selectedInventories = inventories.filter((inventory) => {
    return targetingGroup.inventories?.includes(`${inventory.beeswaxListId}`);
  });
  const targetingGroupCreative = await getTargetingGroupCreative(
    targetingGroup.id ?? '',
  );
  let creative = null;
  if (targetingGroupCreative) {
    creative = await api.creatives.getCreative.query({
      id: targetingGroupCreative?.creativeId,
    });
  }

  return (
    <CardContent>
      <Separator className="mb-4" />
      <h5 className="font-bold mb-4 text-lg">Audience</h5>
      <div className="my-2 text-base">
        <span className="font-bold">Demographics:</span>{' '}
        {Boolean(
          !targetingGroup.age?.length && !targetingGroup.gender?.length,
        ) && <span className="text-base">All</span>}
        {Boolean(targetingGroup.age?.length) &&
          allCategories['Age']
            .filter((ageCategory) =>
              targetingGroup.age?.includes(ageCategory.attribute_uuid),
            )
            .map((ageCategory, i) =>
              i ? `, ${ageCategory.name}` : ageCategory.name,
            )}
        {Boolean(targetingGroup.gender?.length) &&
          allCategories['Gender']
            .filter((genderCategory) =>
              targetingGroup.gender?.includes(genderCategory.attribute_uuid),
            )
            .map((genderCategory) => `, ${genderCategory.name}`)}
      </div>
      <div className="my-2 text-base">
        <span className="font-bold">Audience Categories:</span>{' '}
        {Boolean(!targetingGroup.categories?.length) && (
          <span className="text-base">All</span>
        )}
        {Boolean(targetingGroup.categories?.length) && (
          <ShowAllButton>
            {allCategories['Categories']
              .filter((category) =>
                targetingGroup.categories?.includes(category.attribute_uuid),
              )
              .map((category, i) => (i ? `, ${category.name}` : category.name))}
          </ShowAllButton>
        )}
      </div>
      <div className="my-2 text-base">
        <span className="font-bold">Location:</span>{' '}
        {Boolean(!locations.length && !targetingGroup.geoZipCodes?.length) && (
          <span className="text-base">All</span>
        )}
        {Boolean(locations.length) && (
          <ShowAllButton>
            {locations?.map((city) => (
              <Badge key={city.name} variant="secondary">
                {formatLabels(city)}
              </Badge>
            ))}
          </ShowAllButton>
        )}
        {Boolean(targetingGroup.geoZipCodes?.length) && (
          <ShowAllButton>
            {targetingGroup.geoZipCodes?.map((zipcode) => (
              <Badge key={zipcode} variant="secondary">
                {zipcode}
              </Badge>
            ))}
          </ShowAllButton>
        )}
      </div>
      <Separator className="my-4" />
      <h5 className="font-bold mb-4 text-lg">Delivery</h5>
      <div className="my-2 text-base">
        <span className="font-bold">Inventory:</span>{' '}
        {Boolean(!selectedInventories.length) && (
          <span className="text-base">All</span>
        )}
        {Boolean(selectedInventories.length) && (
          <ShowAllButton>
            {selectedInventories.map(({ name }, i) =>
              i ? `, ${name}` : `${name}`,
            )}
          </ShowAllButton>
        )}
      </div>
      <div className="my-2 text-base">
        <span className="font-bold">Budget:</span>{' '}
        {formatCurrency({
          number: targetingGroup.budget,
          options: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: 'USD',
            style: 'currency',
          },
        })}{' '}
        per day
      </div>
      <div className="my-2 text-base">
        <span className="font-bold">Launch Status:</span>{' '}
        {targetingGroup.beeswaxSync === 'success' && targetingGroup.externalId
          ? 'Ready'
          : 'Not Ready'}
      </div>
      <Separator className="my-4" />
      <h5 className="font-bold mb-4 text-lg">Creative</h5>
      <div className="flex gap-6 items-center">
        {creative?.previewUrl ? (
          <img
            alt={creative.name}
            className="max-h-[300px] max-w-[300px]"
            src={creative.previewUrl}
          />
        ) : (
          <FileVideo size={150} />
        )}
        <div>
          <div className="my-2 text-base">
            <span className="font-bold">Name:</span> {creative?.name}
          </div>
          <div className="my-2 text-base">
            <span className="font-bold">Length:</span>{' '}
            {formatMilliseconds(creative?.durationMS ?? 0)}
          </div>
        </div>
      </div>
    </CardContent>
  );
}
