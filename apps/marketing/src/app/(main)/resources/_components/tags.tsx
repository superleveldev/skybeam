import { Badge } from '@limelight/shared-ui-kit/ui/badge';

import type { Tag } from './types';

export default function Tags({ tags }: { tags?: Tag[] }) {
  return tags?.length ? (
    <div className="flex mt-6 gap-2 flex-row flex-wrap">
      {tags.map((tag) => (
        <Badge
          key={tag._id}
          variant="outline"
          className="border border-[#CDD5DF] text-[#737C8B] rounded-md px-4 py-2 w-fit"
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  ) : null;
}
