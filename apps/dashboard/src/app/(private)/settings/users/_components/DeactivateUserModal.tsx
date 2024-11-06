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
import { deactivateAccount } from '../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeactivateUserModal({ userId }: { userId: string }) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleDeactivate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof deactivateAccount>> | null = null;
    try {
      error = await deactivateAccount(userId);
    } catch (e) {
      toast.error('Something went wrong. Failed to deactivate user.');
    }
    if (error) {
      toast.error(error?.message);
    }
    toast.success('User deactivated successfully.');
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone. This will permanently
            remove this user from this organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/80"
          >
            <Button variant="destructive" onClick={handleDeactivate}>
              Deactivate User
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
