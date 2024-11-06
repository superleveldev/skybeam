'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { useState } from 'react';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react';
import { resetPassword } from '../../../../server/actions';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@limelight/shared-ui-kit/ui/alert';

const passwordResetSchema = z.object({
  newPassword: z.string(),
  oldPassword: z.string(),
  oldPassword2: z.string(),
});

type passwordFormValues = z.infer<typeof passwordResetSchema>;

export default function PasswordReset() {
  const form = useForm<passwordFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {},
  });

  const [showNewPassword, setSetshowNewPassword] = useState(false);
  const [showOldPassword, setSetshowOldPassword] = useState(false);
  const [showOldPassword2, setSetshowOldPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(values: passwordFormValues) {
    const error = await resetPassword(values);
    if (error) {
      setErrorMessage(error.message);
    } else {
      toast.success('Password reset successfully');
      setErrorMessage(null);
      form.reset(
        { newPassword: '', oldPassword: '', oldPassword2: '' },
        { keepValues: false },
      );
    }
  }

  return (
    <Form {...form}>
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription className="flex items-center">
            <TriangleAlert className="size-4 me-2" />
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-base">New Password</FormLabel>
              <FormControl>
                <Input
                  type={showNewPassword ? undefined : 'password'}
                  placeholder={showNewPassword ? '********' : 'password'}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-6"
                onClick={() => setSetshowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-base">Old Password</FormLabel>
              <FormControl>
                <Input
                  type={showOldPassword ? undefined : 'password'}
                  placeholder={showOldPassword ? '********' : 'password'}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-6"
                onClick={() => setSetshowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oldPassword2"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-base">Repeat Old Password</FormLabel>
              <FormControl>
                <Input
                  type={showOldPassword2 ? undefined : 'password'}
                  placeholder={showOldPassword2 ? '********' : 'password'}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-6"
                onClick={() => setSetshowOldPassword2(!showOldPassword2)}
              >
                {showOldPassword2 ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </Form>
  );
}
