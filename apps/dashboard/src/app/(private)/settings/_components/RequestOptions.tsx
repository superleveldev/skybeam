import { Button } from '@limelight/shared-ui-kit/ui/button';

// TODO: Build custom route for handling request approval/rejection

export default function RequestOptions({ requestId }: { requestId: string }) {
  function handleReject() {
    console.log('reject');
  }

  function handleApprove() {
    console.log('approve');
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleReject} variant="secondary">
        Reject
      </Button>
      <Button onClick={handleApprove}>Approve</Button>
    </div>
  );
}
