import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

export default function InviteOptions({
  inviteId,
  disabled,
}: {
  inviteId: string;
  disabled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="disabled:text-muted">
        <EllipsisVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/users/invites/${inviteId}/revoke`}>
          <DropdownMenuItem>Revoke Invitation</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
