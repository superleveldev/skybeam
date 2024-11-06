'use client';

import { toast } from 'sonner';
import { deleteCampaign } from '../../../../server/actions';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { useRouter } from 'next/navigation';

export default function DeleteCampaign({ id }: { id: string }) {
  const router = useRouter();
  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    let error: Awaited<ReturnType<typeof deleteCampaign>> | null = null;
    try {
      error = await deleteCampaign(id);
    } catch (e) {
      toast.error('Something went wrong. Failed to delete campaign.');
    }
    if (error) {
      toast.error(error?.message);
      return;
    }
    toast.success('Campaign deleted successfully.');
    router.back();
  }

  function handleBack(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    router.back();
  }

  return (
    <section className="col-span-9 lg:col-span-5 lg:col-start-3 flex w-full flex-1 flex-col items-center justify-center ">
      <header className="max-w-2xl px-8">
        <h2 className="mb-0.5 text-lg font-medium">Delete Campaign</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          Are you sure? This action cannot be undone. This will permanently
          delete the campaign and all associated targeting groups.
        </p>
      </header>
      <div className="flex w-full justify-between max-w-2xl px-8 mt-6">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Campaign
        </Button>
      </div>
    </section>
  );
}
