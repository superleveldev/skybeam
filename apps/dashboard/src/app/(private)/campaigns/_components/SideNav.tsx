import { cn } from '@limelight/shared-utils/index';
import { List, Package, Plus, Target } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../../trpc/server';

import SideNavDropdown from './SideNavDropdown';
import { Campaign } from '../types';
import { Skeleton } from '@limelight/shared-ui-kit/ui/skeleton';

// TODO: Add side effects of navigation to appropriate links
// TODO: Add active link styles
// TODO: Add tooltips/hints to disabled links

export interface SideNavProps {
  campaignId?: string;
  targetingGroupId?: string;
  step: 'setup' | 'targeting-groups' | 'summary';
}

export default async function SideNav(props: SideNavProps) {
  const { campaignId, targetingGroupId, step } = props;
  let campaign: Campaign | undefined;
  if (campaignId) {
    [campaign] = await api.campaigns.getCampaign.query({
      id: campaignId,
    });
  }

  let targetingGroups: Awaited<
    ReturnType<typeof api.targetingGroups.getTargetingGroups.query>
  > = [];
  if (campaignId) {
    targetingGroups = await api.targetingGroups.getTargetingGroups.query({
      campaignId,
    });
  }

  let showAddTargetingLink = true;

  if (campaign?.objective === 'retargeting') {
    if (targetingGroups?.length) {
      showAddTargetingLink = false;
    }
    if (step === 'targeting-groups') {
      showAddTargetingLink = false;
    }
  }
  return (
    <aside className="hidden lg:block col-span-2">
      <nav className="flex-col flex gap-2 px-8 py-2 text-sm text-muted-foreground">
        <span className="font-semibold flex items-center gap-1">
          <Package className="h-4 w-4" /> Campaign
        </span>
        <Link
          href={`/campaigns/${campaignId ?? 'new'}${campaignId ? '/edit' : ''}`}
          className={cn('ps-5', 'truncate', 'max-w-[15vw]', {
            'text-indigo-600': step === 'setup',
          })}
        >
          {campaign?.name ?? 'New Campaign'}
        </Link>
        <span className="font-semibold  flex items-center gap-1">
          <Target className="h-4 w-4" /> Targeting Groups
        </span>
        {targetingGroups.map((group) => (
          <div className="flex justify-between" key={group.id}>
            <Link
              href={`/campaigns/${campaignId}/targeting-groups/${group.id}/edit`}
              className={cn('ps-5', 'max-w-[15vw]', 'truncate', {
                'text-indigo-600':
                  step === 'targeting-groups' && targetingGroupId === group.id,
              })}
            >
              {group.name}
            </Link>
            <SideNavDropdown
              campaignId={group.campaignId}
              campaignStatus={campaign?.status}
              groupId={group.id}
              hideClone={campaign?.objective === 'retargeting'}
            />
          </div>
        ))}
        {step === 'targeting-groups' && !targetingGroupId && (
          <Link
            href={`/campaigns/${campaignId}/targeting-groups/new`}
            className={'ps-5 text-indigo-600'}
          >
            New Targeting Group
          </Link>
        )}
        {showAddTargetingLink && (
          <Link
            href={`/campaigns/${campaignId}/targeting-groups/new`}
            aria-disabled={step === 'setup' && !campaignId}
            className={cn('ps-5 flex items-center gap-1', {
              'pointer-events-none': step === 'setup' && !campaignId,
            })}
          >
            <Plus className="h-4 w-4" />
            Add group
          </Link>
        )}
        <span className="font-semibold flex items-center gap-1">
          <List className="h-4 w-4" /> Summary
        </span>
        <Link
          href={`/campaigns/${campaignId}/summary`}
          aria-disabled={step === 'setup' && !campaignId}
          className={cn('ps-5', {
            'pointer-events-none': step === 'setup' && !campaignId,
            'text-indigo-600': step === 'summary',
          })}
        >
          Campaign Summary
        </Link>
      </nav>
    </aside>
  );
}

export function SideNavFallback() {
  return (
    <aside className="hidden lg:block col-span-2">
      <nav className="flex-col flex gap-2 px-8 py-2 text-sm text-muted-foreground">
        <span className="font-semibold flex items-center gap-1">
          <Package className="h-4 w-4" /> Campaign
        </span>
        <Skeleton className="ps-5 truncate max-w-[15vw] w-full h-4" />
        <span className="font-semibold  flex items-center gap-1">
          <Target className="h-4 w-4" /> Targeting Groups
        </span>
        <Skeleton className="ps-5 truncate max-w-[15vw] w-full h-4" />
        <Skeleton className="ps-5 truncate max-w-[15vw] w-full h-4" />
        <Skeleton className="ps-5 truncate max-w-[15vw] w-full h-4" />
        <span className="font-semibold flex items-center gap-1">
          <List className="h-4 w-4" /> Summary
        </span>
        <Skeleton className="ps-5 truncate max-w-[15vw] w-full h-4" />
      </nav>
    </aside>
  );
}
