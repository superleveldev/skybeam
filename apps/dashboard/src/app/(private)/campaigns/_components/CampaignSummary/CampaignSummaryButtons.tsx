import { Campaign } from '@limelight/shared-drizzle';
import Link from 'next/link';
import { cn } from '@limelight/shared-utils/index';

export default function CampaignSummaryButtons({
  campaignId,
  disabled,
}: {
  campaignId: string;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-start px-2 md:px-0 w-full">
      <Link
        href={disabled ? '#' : `/campaigns/${campaignId}/summary?c=true`}
        aria-disabled={disabled}
        className={cn('btn btn-primary', {
          'pointer-events-none': disabled,
          'hover:opacity-80': !disabled,
          'opacity-80': disabled,
        })}
      >
        Submit
      </Link>
    </div>
  );
}
