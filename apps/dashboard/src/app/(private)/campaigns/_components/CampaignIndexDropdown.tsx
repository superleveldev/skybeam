import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { PenLine, Copy, Trash2 } from 'lucide-react';
import { CampaignStatus, Objective } from '../types';

export default function CampaignIndexDropdown({
  campaignId,
  campaignObjective,
  campaignStatus,
}: {
  campaignId: string;
  campaignObjective: Objective;
  campaignStatus: CampaignStatus;
}) {
  const displayEdit =
    campaignStatus === 'draft' ||
    (campaignStatus === 'published' && campaignObjective === 'awareness');
  const displayDelete = campaignStatus === 'draft';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {displayEdit && (
          <>
            <Link href={`/campaigns/${campaignId}/edit`}>
              <DropdownMenuItem>
                <PenLine className="w-4 h-4 me-2" /> Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        <Link href={`/campaigns/clone/${campaignId}`}>
          <DropdownMenuItem>
            <Copy className="w-4 h-4 me-2" />
            Duplicate
          </DropdownMenuItem>
        </Link>
        {displayDelete && (
          <>
            <DropdownMenuSeparator />
            <Link href={`/campaigns/delete/${campaignId}`}>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 me-2" />
                Delete
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
