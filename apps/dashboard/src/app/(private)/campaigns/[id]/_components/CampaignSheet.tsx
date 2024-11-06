'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@limelight/shared-ui-kit/ui/sheet';
import CampaignSummary from '../../_components/CampaignSummary/CampaignSummary';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Campaign } from '../../types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@limelight/shared-ui-kit/ui/card';
import { Flag, Goal, Package, PencilLine, Repeat, Tv } from 'lucide-react';
import Link from 'next/link';
import { format, formatDistance } from 'date-fns';
import { capitalize, formatCurrency } from '@limelight/shared-utils/index';
import { ReactNode } from 'react';

const objectiveMap: Record<Campaign['objective'], ReactNode> = {
  awareness: <Tv className="size-4" />,
  performance: <Goal className="size-4" />,
  retargeting: <Repeat className="size-4" />,
  conquering: <Flag className="size-4" />,
};

export default function CampaignSheet({ campaign }: { campaign: Campaign }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const open = searchParams.get('details') === 'true';

  const onOpenChange = (shouldBeOpen: boolean) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (shouldBeOpen) {
      nextSearchParams.set('details', 'true');
    } else {
      nextSearchParams.delete('details');
    }
    router.push(`${pathname}?${nextSearchParams.toString()}`);
  };

  if (!campaign) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="px-0 w-full min-w-[45%]">
        <SheetHeader className="border-b">
          <SheetTitle className="px-6 mb-6">Campaign Info</SheetTitle>
        </SheetHeader>
        <div className="mt-3 pt-6 px-6 space-y-4">
          <h3 className="font-bold">Summary</h3>
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
                  {formatDistance(campaign.startDate, campaign.endDate)}{' '}
                  duration)
                </div>
                <div>
                  <span className="font-bold">
                    {capitalize(campaign.budgetType)} Budget:
                  </span>{' '}
                  {formatCurrency({ number: campaign.budget })}
                </div>
                <div>
                  <span className="font-bold">Frequency:</span>{' '}
                  {campaign.frequency} per {campaign.frequencyPeriod}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
