import { redirect } from 'next/navigation';

export default async function TargetingGroupsList({
  params: { id },
}: {
  params: { id: string };
}) {
  /** temporarily redirecting to the new targeting groups page until we have suitable content for a targeting groups list view */
  redirect(`/campaigns/${id}/targeting-groups/new`);
}
