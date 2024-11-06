import DeactivateUserModal from '../../../../_components/DeactivateUserModal';

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  return <DeactivateUserModal userId={userId} />;
}
