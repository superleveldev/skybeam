'use client';

import { RefreshCw } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from 'sonner';
import { useAuth, useClerk } from '@clerk/nextjs';
import React from 'react';
import { OrganizationDeleteModal } from './delete-modal';
import { api } from '../../../../trpc/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { Button } from '@limelight/shared-ui-kit/ui/button';

const organizationFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export const OrganizationForm = ({ name }: { name: string }) => {
  const { signOut, organization } = useClerk();

  const authData = useAuth();
  const updateOrganization = api.organizations.updateOrganization.useMutation();

  const defaultValues: Partial<OrganizationFormValues> = {
    name,
  };

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  async function onSubmit(data: OrganizationFormValues) {
    await updateOrganization.mutateAsync({
      name: data.name,
    });

    toast.success('Organization updated!');
  }

  const canEditOrganization = authData.orgRole === 'org:admin';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5">
            <span className="text-base">Organization name</span>
          </label>
          <div className="flex flex-row gap-3">
            <div className="inline-flex flex-1 shadow-sm">
              <div className="relative flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  disabled={!canEditOrganization}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {canEditOrganization && (
          <div className="mt-6 flex items-center justify-end gap-4">
            <OrganizationDeleteModal />

            <Button
              variant={'secondary'}
              type={'submit'}
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting && (
                <div className="flex items-center truncate">Update</div>
              )}
              {form.formState.isSubmitting && (
                <RefreshCw className={'h-4 w-4 animate-spin'} />
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
