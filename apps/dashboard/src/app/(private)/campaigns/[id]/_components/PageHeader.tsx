import { ChevronLeft, PencilLine } from 'lucide-react';
import Link from 'next/link';

export default function PageHeader({ id }: { id: string }) {
  return (
    <header className="sticky -mt-10 mb-10 flex w-full items-center justify-evenly gap-4 border-b bg-gray-50 px-4 md:px-14 py-4">
      <div className="flex w-1/2 items-center justify-start gap-2 text-sm font-medium">
        <Link href="/campaigns" className="flex gap-2 items-center">
          <ChevronLeft className="size-4" /> All Campaigns
        </Link>
      </div>
      <div className="flex w-1/2 items-center justify-end text-sm font-medium">
        <Link
          href={`/campaigns/${id}/edit`}
          className="btn btn-secondary gap-2 shadow-sm"
        >
          <PencilLine className="size-4" /> Edit Campaign
        </Link>
      </div>
    </header>
  );
}
