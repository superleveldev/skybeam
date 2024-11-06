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
import { deleteAdvertiser } from '../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteAdvertiserModal({
  advertiserId,
}: {
  advertiserId: string;
}) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof deleteAdvertiser>> | null = null;
    try {
      error = await deleteAdvertiser(advertiserId);
    } catch (e) {
      toast.error('Something went wrong. Failed to delete advertiser.');
    }
    if (error) {
      toast.error(error?.message);
    }
    toast.success('Advertiser deleted successfully.');
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone. This will permanently
            delete the advertiser and all associated campaigns.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/80"
          >
            <Button variant="destructive" onClick={handleDelete}>
              Delete Advertiser
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
