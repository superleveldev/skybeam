'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@limelight/shared-ui-kit/ui/dialog';
import { Trash } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { deleteOrganization } from '../../../../server/actions';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
  email: z.string().email({
    message: 'Must be a valid email.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function OrganizationDeleteModal() {
  const { signOut } = useClerk();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} type={'button'}>
          Delete organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <div className="flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle className={'flex flex-row items-center'}>
              <Trash className={'mr-2'} /> Delete Organization
            </DialogTitle>
            <DialogDescription className={''}>
              Are you sure you want to do this? All memberships, data,
              subscriptions, etc. will be deleted - this is permanent!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={'secondary'}
              type="button"
              className={'w-full'}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={'destructive'}
              type="button"
              className={'w-full'}
              onClick={async () => {
                await deleteOrganization()
                  .then(() => {
                    signOut(() => router.push('/'));
                  })
                  .catch((e) => {
                    toast.error('Error', {
                      description: e.message,
                    });

                    // setLoading(false);
                  });
              }}
            >
              Delete organization
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
