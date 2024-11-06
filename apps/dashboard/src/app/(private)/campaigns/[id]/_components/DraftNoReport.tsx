import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { Campaign } from '../../types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function DraftNoReport({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="w-full h-96 p-4">
      <CardContent className="flex h-full flex-col justify-center items-center space-y-2">
        <div className="text-xl font-semibold">{campaign.name} is a draft</div>

        <p className="font-normal">
          Report data will be available once the campaign is live and has
          started.
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
