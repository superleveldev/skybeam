'use client';

import { useOrganization } from '@clerk/nextjs';
import { Badge } from '@limelight/shared-ui-kit/ui/badge';
import { cn } from '@limelight/shared-utils/index';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

//  TODO: Add Request Link when server-side handling is ready

function ActiveLink(props: React.ComponentPropsWithRef<typeof Link>) {
  const { className, href } = props;
  const pathname = usePathname();
  const isActive = pathname === href;
  const textColor = isActive ? 'text-primary border-primary' : 'text-body';

  return (
    <Link
      {...props}
      className={cn(
        textColor,
        className,
        'py-2 px-3 inline-block text-sm font-medium border-b-2',
      )}
    />
  );
}

export default function UserTabs({
  totalMembers,
  totalInvites,
}: {
  totalMembers?: number;
  totalInvites?: number;
}) {
  return (
    <nav className="">
      <ActiveLink href="/settings/users" className="transition-colors ">
        Members{' '}
        {totalMembers !== undefined && (
          <Badge variant="default" className="rounded-full">
            {totalMembers}
          </Badge>
        )}
      </ActiveLink>
      <ActiveLink href="/settings/users/invites" className="transition-colors ">
        Invites{' '}
        {!!totalInvites && (
          <Badge variant="default" className="rounded-full">
            {totalInvites}
          </Badge>
        )}
      </ActiveLink>
    </nav>
  );
}
