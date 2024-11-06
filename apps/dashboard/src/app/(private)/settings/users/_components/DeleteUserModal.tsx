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
import { deleteAccount, deleteAdvertiser } from '../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteUserModal({ userId }: { userId: string }) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof deleteAccount>> | null = null;
    try {
      error = await deleteAccount(userId);
    } catch (e) {
      toast.error('Something went wrong. Failed to delete user.');
    }
    if (error) {
      toast.error(error?.message);
    }
    toast.success('User deleted successfully.');
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone. This will permanently
            delete this user and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/80"
          >
            <Button variant="destructive" onClick={handleDelete}>
              Delete User
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
