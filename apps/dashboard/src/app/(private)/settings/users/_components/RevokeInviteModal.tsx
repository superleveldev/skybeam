'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@limelight/shared-ui-kit/ui/alert-dialog';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { revokeInvitation } from '../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RevokeInviteModal({ inviteId }: { inviteId: string }) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleRevoke(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof revokeInvitation>> | null = null;
    try {
      error = await revokeInvitation(inviteId);
    } catch (e) {
      toast.error('Something went wrong. Failed to revoke invite.');
    }
    if (error) {
      toast.error(error?.message);
    }
    toast.success('Invite revoked successfully.');
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone. This will permanently
            revoke this user's invitation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/80"
          >
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Invitation
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
