'use client';

import { Sheet, SheetContent } from '@limelight/shared-ui-kit/ui/sheet';
import { useRouter } from 'next/navigation';

export const AdvertiserSheetClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent className="px-0">{children}</SheetContent>
    </Sheet>
  );
};
