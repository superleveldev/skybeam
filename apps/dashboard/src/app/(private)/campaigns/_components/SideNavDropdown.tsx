'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import DeleteTargetingModal from '../[id]/targeting-groups/_components/DeleteTargetingModal';
import Link from 'next/link';
import { CampaignStatus } from '../types';

export default function SideNavDropdown({
  campaignId,
  campaignStatus,
  groupId,
  hideClone,
}: {
  campaignId: string;
  campaignStatus?: CampaignStatus;
  groupId: string;
  hideClone?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!hideClone && (
            <Link
              href={`/campaigns/${campaignId}/targeting-groups/${groupId}/clone`}
            >
              <DropdownMenuItem>Clone</DropdownMenuItem>
            </Link>
          )}
          {campaignStatus !== 'published' && (
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen ? (
        <DeleteTargetingModal
          id={campaignId}
          groupId={groupId}
          setIsOpen={setIsOpen}
        />
      ) : null}
    </>
  );
}
