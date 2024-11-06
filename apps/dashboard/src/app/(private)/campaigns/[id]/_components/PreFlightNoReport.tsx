import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { Campaign } from '../../types';
import { formatInTimeZone } from 'date-fns-tz';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PreFlightNoReport({
  campaign,
}: {
  campaign: Campaign;
}) {
  return (
    <Card className="w-full h-96 p-4">
      <CardContent className="flex h-full flex-col justify-center items-center space-y-2">
        <div className="text-xl font-semibold">
          {campaign.name} has NOT STARTED
        </div>
        <p className="font-normal">
          It will start on{' '}
          {formatInTimeZone(
            campaign.startDate,
            campaign.timezone.value,
            'MM/dd/yyyy hh:mm a',
          )}{' '}
          {campaign.timezone.abbrev}
        </p>
        <p className="font-normal">
          We will notify you via email when your campaign goes live!
        </p>
        <Link
          href="/campaigns"
          className="flex gap-1 text-blue-600 items-center"
        >
          <ChevronLeft className="size-4" /> All Campaigns
        </Link>
      </CardContent>
    </Card>
  );
}
