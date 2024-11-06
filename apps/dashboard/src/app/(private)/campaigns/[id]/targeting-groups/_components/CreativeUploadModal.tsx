import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@limelight/shared-ui-kit/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@limelight/shared-ui-kit/ui/form';
import { Input } from '@limelight/shared-ui-kit/ui/input';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadCreativeSchema } from '@limelight/shared-drizzle';
import { toast } from 'sonner';
import { upload } from '@vercel/blob/client';
import { api } from '../../../../../../trpc/react';

export default function CreativeUploadModal({
  advertiserId,
  onSuccess,
  open,
  toggleOpen,
}: {
  advertiserId: string;
  open: boolean;
  onSuccess: () => void;
  toggleOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof UploadCreativeSchema>>({
    resolver: zodResolver(UploadCreativeSchema),
    defaultValues: {
      name: '',
      file: null,
    },
  });

  const insertBaseCreativeMutation =
    api.creatives.insertBaseCreative.useMutation();

  async function onSubmit(formData: z.infer<typeof UploadCreativeSchema>) {
    const { name, file } = formData;
    let extension = '';
    switch (file.type) {
      case 'video/mp4':
        extension = 'mp4';
        break;
      case 'video/quicktime':
        extension = 'mov';
        break;
    }
    try {
      const [creative] = await insertBaseCreativeMutation.mutateAsync({
        name,
        advertiserId,
      });
      await upload(
        `skybeam/advertisers/${advertiserId}/creatives/${creative.id}/creative.${extension}`,
        file,
        {
          access: 'public',
          handleUploadUrl: '/api/creatives',
          clientPayload: creative.id,
        },
      );
      onSuccess();
      toast.success('Creative uploaded successfully.');
      toggleOpen(false);
    } catch (error) {
      toast.error('Something went wrong; please try again or contact support.');
    }
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form;

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Creative</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Only MP4 or MOV files are supported.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input id="name" onChange={field.onChange} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="file"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      accept=".mp4,.mov"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        field.onChange(file);
                      }}
                      ref={field.ref}
                      type="file"
                      value={field.value?.fileName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Creative</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
