import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@limelight/shared-ui-kit/ui/dialog';
import { Advertiser } from '@limelight/shared-drizzle';
import AdvertiserForm from './AdvertiserForm';

export default function AdvertiserModal({
  onSuccess: _onSuccess,
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  onSuccess?: (newAdvertiser?: Advertiser) => void;
}) {
  async function onSuccess(newAdvertiser?: Advertiser) {
    _onSuccess?.(newAdvertiser);
    toggleOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Advertiser</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new advertiser to your account
        </DialogDescription>
        <AdvertiserForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
