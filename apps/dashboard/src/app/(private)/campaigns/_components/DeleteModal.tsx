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
import { deleteCampaign } from '../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteCampaignModal({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof deleteCampaign>> | null = null;
    try {
      error = await deleteCampaign(campaignId);
    } catch (e) {
      toast.error('Something went wrong. Failed to delete campaign.');
    }
    if (error) {
      toast.error(error?.message);
    }
    toast.success('Campaign deleted successfully.');
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently the campaign and
            all associated targeting groups.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/80"
          >
            <Button variant="destructive" onClick={handleDelete}>
              Delete Campaign
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
