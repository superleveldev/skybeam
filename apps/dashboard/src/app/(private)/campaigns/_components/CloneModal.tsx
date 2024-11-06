'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@limelight/shared-ui-kit/ui/dialog';
import { useRouter } from 'next/navigation';

export default function CloneModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Duplicate Campaign</DialogTitle>
          <DialogDescription>
            Duplicate this campaign to create a new one.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
