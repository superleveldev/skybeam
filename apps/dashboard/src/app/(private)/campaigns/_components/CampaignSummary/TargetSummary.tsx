import { FormTargetingGroup } from '@limelight/shared-drizzle';
import { api } from '../../../../../trpc/server';
import { Card, CardHeader } from '@limelight/shared-ui-kit/ui/card';
import { CircleAlert, PencilLine, Target } from 'lucide-react';
import Link from 'next/link';
import { TargetingSegment } from '../../../../../server/api/routers/tinybird/targeting-segments';
import TargetSummaryCard from './TargetSummaryCard';
import { Alert, AlertTitle } from '@limelight/shared-ui-kit/ui/alert';
import { checkValidity } from '../../../../../server/queries';

export default async function TargetSummary({
  campaignId,
}: {
  campaignId: string;
}) {
  const { campaign, targetingGroups, targetingGroupErrors } =
    await checkValidity({ campaignId }, { includeCampaign: false });

  const fetchedCategories = await api.tinybird.targetingSegments.all.query({});

  const allFormattedCategories = fetchedCategories.reduce(
    (acc: { [key: string]: TargetingSegment[] }, segment) => {
      if (
        segment.classification === 'Age' ||
        segment.classification === 'Gender'
      ) {
        acc[segment.classification].push(segment);
      } else {
        acc['Categories'].push(segment);
      }
      return acc;
    },
    { Age: [], Gender: [], Categories: [] },
  );

  return (
    <>
      <h3 className="font-bold my-4 text-left text-lg  w-full">
        Target Groups
      </h3>
      {campaign?.objective === 'retargeting' && targetingGroups.length > 1 && (
        <Alert variant="destructive">
          <AlertTitle className="flex gap-2 items-center">
            <CircleAlert className="size-6 " /> Too Many Targeting Groups
          </AlertTitle>
          <p>
            Retargeting campaigns can only have 1 targeting group. Please delete
            your extra targeting groups.
          </p>
        </Alert>
      )}
      {targetingGroups.length === 0 && (
        <Alert variant="destructive">
          <AlertTitle className="flex gap-2 items-center">
            <CircleAlert className="size-6 " /> No Targeting Groups
          </AlertTitle>
          <p>
            Campaigns must have at least 1 targeting group.{' '}
            <Link
              className="inline-flex items-baseline gap-2 underline"
              href={`/campaigns/${campaignId}/targeting-groups/new`}
            >
              Add a targeting group now.
            </Link>
          </p>
        </Alert>
      )}
      {targetingGroups.map((targetingGroup: FormTargetingGroup) => {
        return (
          <>
            {targetingGroup?.id &&
              targetingGroup.id in targetingGroupErrors && (
                <Alert variant="destructive">
                  <AlertTitle className="flex gap-2 items-center">
                    <CircleAlert className="size-6 " /> Invalid Targeting Group
                  </AlertTitle>
                  <ul className="space-y-2">
                    {targetingGroupErrors[targetingGroup.id].map((error) => (
                      <li key={`${error.code}${error?.path}`}>
                        {error.message}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    <Link
                      className="inline-flex items-baseline gap-2 underline"
                      href={`/campaigns/${campaignId}/targeting-groups/${targetingGroup.id}/edit`}
                    >
                      Edit targeting group
                    </Link>
                  </p>
                </Alert>
              )}
            <Card className="mb-8 w-full" key={targetingGroup.id}>
              <CardHeader className="flex flex-row items-center font-medium justify-between py-4 text-lg">
                <div className="flex flex-row gap-2">
                  <Target />
                  <span>{targetingGroup.name}</span>
                </div>
                <Link
                  className="btn btn-secondary gap-2"
                  href={`/campaigns/${campaignId}/targeting-groups/${targetingGroup.id}/edit`}
                >
                  <PencilLine className="size-4" />
                  Edit
                </Link>
              </CardHeader>
              <TargetSummaryCard
                allCategories={allFormattedCategories}
                targetingGroup={targetingGroup}
              />
            </Card>
          </>
        );
      })}
    </>
  );
}
