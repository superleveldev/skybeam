import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

export default function UserOptions({
  userId,
  disabled = false,
}: {
  userId: string;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className="disabled:pointer-events-none disabled:opacity-50"
      >
        <EllipsisVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={disabled ? '#' : `/users/${userId}/deactivate`}>
          <DropdownMenuItem>Deactivate</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
