import { redirect } from 'next/navigation';

export default async function TargetingGroupsDetail({
  params: { id, groupId },
}: {
  params: { id: string; groupId: string };
}) {
  /** temporarily redirecting to the edit targeting groups page until we have suitable content for a targeting group detail view */
  redirect(`/campaigns/${id}/targeting-groups/${groupId}/edit`);
}
