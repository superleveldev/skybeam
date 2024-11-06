import {
  Card,
  CardContent,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
import { ReactNode } from 'react';
import {
  CircleAlert,
  Flag,
  Goal,
  Package,
  PencilLine,
  Repeat,
  Tv,
} from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '../../types';
import { format, formatDistance } from 'date-fns';
import { capitalize, formatCurrency } from '@limelight/shared-utils/index';
import { checkValidity } from '../../../../../server/queries';
import { Alert, AlertTitle } from '@limelight/shared-ui-kit/ui/alert';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

const objectiveMap: Record<Campaign['objective'], ReactNode> = {
  awareness: <Tv className="size-4" />,
  performance: <Goal className="size-4" />,
  retargeting: <Repeat className="size-4" />,
  conquering: <Flag className="size-4" />,
};

export default async function CampaignSummary({
  campaignId,
}: {
  campaignId: string;
}) {
  const { campaign, campaignErrors } = await checkValidity(
    { campaignId },
    { includeTargetingGroups: false },
  );
  return (
    <>
      {!!campaignErrors.length && (
        <Alert variant="destructive">
          <AlertTitle className="flex gap-2 items-center">
            <CircleAlert className="size-6 " /> Invalid Campaign
          </AlertTitle>
          <ul className="space-y-2">
            {campaignErrors.map((error) => (
              <li key={`${error.code}${error?.path}`}>{error.message}</li>
            ))}
          </ul>
          <p className="mt-2">
            <Link
              className="inline-flex items-baseline gap-2 underline"
              href={`/campaigns/${campaign.id}/edit`}
            >
              Edit campaign
            </Link>
          </p>
        </Alert>
      )}
      <Card className="mb-2 w-full">
        <CardHeader className="flex gap-2 flex-row justify-between items-baseline py-4">
          <div className="flex gap-2 justify-start items-center text-lg font-medium">
            <Package className="size-4" /> {campaign.name}
          </div>
          <Link
            className="btn btn-secondary gap-2"
            href={`/campaigns/${campaign.id}/edit`}
          >
            <PencilLine className="size-4" />
            Edit
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-base">
            <div>
              <span className="font-bold">Advertiser:</span>{' '}
              {campaign?.advertiser?.name}
            </div>
            <div className="flex gap-2 justify-start items-center">
              <span className="font-bold">Objective:</span>{' '}
              {objectiveMap[campaign.objective]}
              {capitalize(campaign.objective)}
            </div>
            <div>
              <span className="font-bold">Start:</span>{' '}
              {format(campaign.startDate, 'MM/dd/yyyy HH:mm a')}{' '}
              {campaign?.timezone?.abbrev}
            </div>
            <div>
              <span className="font-bold">End:</span>{' '}
              {format(campaign.endDate, 'MM/dd/yyyy HH:mm a')} (
              {formatDistance(campaign.startDate, campaign.endDate)} duration)
            </div>
            <div>
              <span className="font-bold">
                {capitalize(campaign.budgetType)} Budget:
              </span>{' '}
              {formatCurrency({
                number: campaign.budget,
                options: {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  currency: 'USD',
                  style: 'currency',
                },
              })}
            </div>
            <div>
              <span className="font-bold">Frequency:</span> {campaign.frequency}{' '}
              per {campaign.frequencyPeriod}
            </div>
            <div>
              <span className="font-bold">Launch Status:</span>{' '}
              {campaign.beeswaxSync === 'success' && campaign.externalId
                ? 'Ready'
                : 'Not Ready'}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function CampaignSummaryFallback() {
  return (
    <Card className="mb-2 w-full">
      <CardHeader className="flex gap-2 flex-row justify-between items-baseline py-4">
        <div className="flex gap-2 justify-start items-center text-lg font-medium w-full">
          <Skeleton className="w-4/6 h-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-base">
          <div>
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div className="flex gap-2 justify-start items-center">
            <Skeleton className="w-1/3 h-4" />
          </div>
          <div>
            <Skeleton className="w-1/4 h-4" />
          </div>
          <div>
            <Skeleton className="w-5/6 h-4" />
          </div>
          <div>
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div>
            <Skeleton className="w-1/3 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
