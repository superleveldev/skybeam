import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@limelight/shared-ui-kit/ui/dropdown';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { PenLine, Trash2 } from 'lucide-react';

export default function AdvertiserOptions({
  advertiserId,
}: {
  advertiserId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/advertisers/${advertiserId}/edit`}>
          <DropdownMenuItem>
            <PenLine className="w-4 h-4 me-2" /> Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href={`/advertisers/${advertiserId}/delete`}>
          <DropdownMenuItem>
            <Trash2 className="h-4 w-4 me-2" />
            Delete
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
