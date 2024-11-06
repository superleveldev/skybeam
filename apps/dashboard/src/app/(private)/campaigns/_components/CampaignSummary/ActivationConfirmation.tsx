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
import { activateCampaign } from '../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function ActivationConfirmation({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  async function handleActivate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsLoading(true);
    let error: Awaited<ReturnType<typeof activateCampaign>> | null = null;
    try {
      error = await activateCampaign(campaignId);
    } catch (e) {
      toast.error('Something went wrong. Failed to activate campaign.');
    }
    if (error) {
      toast.error(error?.message);
    } else {
      toast.success('Campaign activated successfully.');
    }
    setIsLoading(false);
  }

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ready to Activate Your Campaign?</AlertDialogTitle>
          <AlertDialogDescription>
            By clicking "Activate Campaign" you will start your campaign and be
            charged for the budget you have set on the campaign start date.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild className="bg-primary hover:bg-primary/80">
            <Button
              disabled={isLoading}
              onClick={handleActivate}
              className="flex gap-2 items-center"
            >
              Activate Campaign
              {isLoading && <RefreshCcw className="animate-spin" />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
