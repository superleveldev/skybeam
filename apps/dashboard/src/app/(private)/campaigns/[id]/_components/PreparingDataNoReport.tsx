import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PreparingDataNoReport({
  campaignName,
}: {
  campaignName: string;
}) {
  return (
    <Card className="w-full h-96 p-4">
      <CardContent className="flex h-full flex-col justify-center items-center space-y-2">
        <div className="text-xl font-semibold">
          {campaignName} has just started
        </div>
        <p className="font-normal">
          We are preparing campaign report data. It should be available soon.
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
