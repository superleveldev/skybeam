import RevokeInviteModal from '../../../../../_components/RevokeInviteModal';

export default function RevokeInvitationPage({
  params: { inviteId },
}: {
  params: { inviteId: string };
}) {
  return <RevokeInviteModal inviteId={inviteId} />;
}
