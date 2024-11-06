'use client';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { DialogFooter } from '@limelight/shared-ui-kit/ui/dialog';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { useForm } from 'react-hook-form';
import {
  Advertiser,
  AdvertiserLogoSchema,
  FormAdvertiser,
  industryEnum,
  InsertAdvertiserSchema,
} from '@limelight/shared-drizzle';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@limelight/shared-ui-kit/ui/select';
import { upload } from '@vercel/blob/client';
import { randomBytes } from 'crypto';
import { toast } from 'sonner';
import { useEffect, useCallback, useRef, useState, ChangeEvent } from 'react';
import { createAdvertiser, updateAdvertiser } from '../../../server/actions';

export default function AdvertiserForm({
  onSuccess,
  advertiser,
  redirectUrl,
}: {
  onSuccess?: (newAdvertiser?: Advertiser) => void;
  advertiser?: Advertiser;
  redirectUrl?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const form = useForm<FormAdvertiser>({
    resolver: zodResolver(InsertAdvertiserSchema),
    defaultValues: {
      name: advertiser?.name ?? '',
      website: advertiser?.website ?? '',
      industry: advertiser?.industry,
    },
  });

  const handleFileSubmit = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const result = AdvertiserLogoSchema.safeParse({ logo: file });
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        if (ref.current?.value) ref.current.value = '';
        return;
      }
      setLogo(file);
    },
    [setLogo],
  );

  useEffect(() => {
    form.reset({
      name: advertiser?.name ?? '',
      website: advertiser?.website ?? '',
      industry: advertiser?.industry,
    });
  }, [advertiser]);

  async function onSubmit(values: FormAdvertiser) {
    let error: Awaited<ReturnType<typeof createAdvertiser>> | null = null;

    let logoPayload = {};
    if (logo) {
      const extension = logo.type.split('/').pop();
      const tempId = randomBytes(20).toString('hex');

      const uploadedLogo = await upload(
        `skybeam/advertisers/logos/${values.name}-${tempId}.${extension}`,
        logo,
        {
          access: 'public',
          handleUploadUrl: '/api/advertisers/logo',
        },
      );
      logoPayload = { logoUrl: uploadedLogo.url };
    }
    if (advertiser?.id) {
      error = await updateAdvertiser({
        id: advertiser.id,
        ...values,
        ...logoPayload,
      });
    } else {
      error = await createAdvertiser(
        { ...values, ...logoPayload },
        redirectUrl,
      );
    }

    if (!error) {
      onSuccess?.();
      toast.success(
        `Advertiser ${advertiser?.id ? 'updated' : 'added'}  successfully`,
      );
      return;
    }

    if (error?.field) {
      form.setError(
        error.field,
        {
          type: 'value',
          message: error.message,
        },
        { shouldFocus: true },
      );
      return;
    }

    toast.error('Error', {
      description: error?.message || 'An error occurred',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem className="mt-2">
          <FormLabel className="text-base" htmlFor="logo">
            Logo
          </FormLabel>
          <FormDescription className="mt-0 text-sm">
            Logo Requirements: JPEG or PNG, Max size 4MB
          </FormDescription>
          <Input
            accept=".png,.jpeg"
            className="mt-0"
            id="logo"
            onChange={handleFileSubmit}
            ref={ref}
            type="file"
          />
        </FormItem>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Name</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Website</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Industry</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(e) => field.onChange(e)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="add-industry-trigger">
                      <SelectValue placeholder="Select an Industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryEnum.enumValues.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">
            {advertiser?.id ? 'Save' : 'Add'} Advertiser
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
