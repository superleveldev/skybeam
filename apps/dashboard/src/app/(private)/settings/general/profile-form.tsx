'use client';

import { RefreshCw, Upload } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { toast } from 'sonner';
import { updateProfile } from '../../../../server/actions';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { Button } from '@limelight/shared-ui-kit/ui/button';

const phonePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(200, {
      message: 'Name must not be longer than 200 characters.',
    }),
  email: z.string().email(),
  phone: z.string().regex(phonePattern, 'Invalid phone number').optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileForm = ({
  firstName,
  lastName,
  email,
  phone,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) => {
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    email: email ?? '',
    phone: phone,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  async function onSubmit(data: ProfileFormValues) {
    await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    toast.success('Profile updated!');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-sm w-full"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-start gap-4">
          <Button
            variant={'secondary'}
            type={'submit'}
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting && (
              <div className="flex items-center truncate">Save Settings</div>
            )}
            {form.formState.isSubmitting && (
              <RefreshCw className={'h-4 w-4 animate-spin'} />
            )}
          </Button>
        </div>
      </form>
      <div className="border-t border-gray-300 py-2 mt-6">
        <h4 className="text-base font-semibold">Delete profile</h4>
        <p className="text-muted-foreground text-sm mt-4">
          Profile deletion cannot be undone.
        </p>
        <Button variant="destructive" className="mt-4">
          Delete profile
        </Button>
      </div>
    </Form>
  );
};
