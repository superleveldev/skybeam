'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@limelight/shared-ui-kit/ui/dialog';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { deleteTargetingGroup } from '../../../../../../server/actions';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteTargetingModal({
  id,
  groupId,
  setIsOpen,
}: {
  id: string;
  groupId: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setIsOpen(false);
    }
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await deleteTargetingGroup(groupId);
    } catch (e) {
      toast.error('Something went wrong. Failed to delete target.');
    }
    toast.success('Targeting Group deleted successfully.');
    router.push('/campaigns');
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            targeting group.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogFooter className="bg-destructive hover:bg-destructive/80">
            <Button variant="destructive" onClick={handleDelete}>
              Delete Targeting Group
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
