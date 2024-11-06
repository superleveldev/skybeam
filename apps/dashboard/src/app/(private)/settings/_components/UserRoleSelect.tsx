import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@limelight/shared-ui-kit/ui/select';
import { changeMembershipRole } from '../../../../server/actions';
import { toast } from 'sonner';

const MembershipMap = {
  'org:member': 'Member',
  'org:admin': 'Admin',
};

export default function UserRoleSelect({
  role,
  userId,
}: {
  role: string;
  userId: string;
}) {
  async function handleValueChange(value: string) {
    if (value === role) {
      return;
    }
    try {
      changeMembershipRole({ userId, role: value });
      toast.success('Role changed successfully');
    } catch (error) {
      toast.error('Failed to change role');
    }
  }
  return (
    <Select onValueChange={handleValueChange} value={role}>
      <SelectTrigger data-testid="role-select-trigger">
        <SelectValue placeholder="Select a Role" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MembershipMap)?.map(([membership, label]) => (
          <SelectItem key={membership} value={membership}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
