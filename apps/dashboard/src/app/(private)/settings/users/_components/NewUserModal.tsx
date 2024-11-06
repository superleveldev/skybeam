'use client';

import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@limelight/shared-ui-kit/ui/dialog';
import { useRouter } from 'next/navigation';
import UserForm from '../../../_components/UserForm';

export default function NewUserModal() {
  const router = useRouter();

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      router.back();
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new user to your organization
        </DialogDescription>
        <UserForm />
      </DialogContent>
    </Dialog>
  );
}
