'use client';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { DialogFooter } from '@limelight/shared-ui-kit/ui/dialog';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { inviteUser } from '../../../server/actions';
import { z } from 'zod';

const newUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(200, 'Name must be under 200 characters.'),
  email: z.string().email(),
});

type newUser = z.infer<typeof newUserSchema>;

export default function UserForm() {
  const form = useForm<newUser>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    form.reset({
      name: '',
      email: '',
    });
  }, []);

  async function onSubmit(values: newUser) {
    let error: Awaited<ReturnType<typeof inviteUser>> | null = null;

    error = await inviteUser(values);

    if (!error) {
      toast.success(`User invited successfully`);
      return;
    }

    toast.error('Error', {
      description: error?.message || 'An error occurred',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Add User</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
