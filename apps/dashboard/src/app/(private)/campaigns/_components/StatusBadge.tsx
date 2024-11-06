import { Campaign } from '@limelight/shared-drizzle';
import { Badge, BadgeProps } from '@limelight/shared-ui-kit/ui/badge';
import { capitalize } from '@limelight/shared-utils/index';
const STATUS_VARIANT_MAP: Record<Campaign['status'], BadgeProps['variant']> = {
  draft: 'outline',
  published: 'primary',
  finished: 'warning',
};

export default function StatusBadge({ status }: Pick<Campaign, 'status'>) {
  return (
    <Badge variant={STATUS_VARIANT_MAP[status]}>{capitalize(status)}</Badge>
  );
}
