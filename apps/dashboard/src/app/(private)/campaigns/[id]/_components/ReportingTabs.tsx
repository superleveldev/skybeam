import { cn } from '@limelight/shared-utils/index';
import Link from 'next/link';

const DIMENSIONS_MAP = {
  impression_date: {
    code: 'impression_date',
    label: 'Day',
  },
  targeting_group_name: {
    code: 'targeting_group_name',
    label: 'Targeting Group',
  },
  daypart: {
    code: 'daypart',
    label: 'Daypart',
  },
  hour_of_day: {
    code: 'hour_of_day',
    label: 'Time',
  },
  zip_code: {
    code: 'zip_code',
    label: 'Location',
  },
  app_name: {
    code: 'app_name',
    label: 'Inventory',
  },
};

const DIMENSIONS = Object.values(DIMENSIONS_MAP);

export default function ReportingTabs({
  searchParams,
  id,
}: {
  searchParams: Record<string, string>;
  id: string;
}) {
  return (
    <div className="flex justify-start w-full px-12 mb-4">
      <nav className="flex border-b w-full">
        {DIMENSIONS.map((dimension) => (
          <Link
            key={dimension.code}
            style={{ borderRadius: '0px' }}
            href={`/campaigns/${id}?${getNewParams(
              new URLSearchParams(searchParams),
              { metric: dimension.code, sort: dimension.code },
            ).toString()}`}
            className={cn('btn btn-ghost border-b rounded-none', {
              'border-primary border-b-2':
                searchParams.metric === dimension.code ||
                (searchParams.metric === undefined &&
                  dimension.code === 'impression_date'),
            })}
          >
            {dimension.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function getNewParams(
  params: URLSearchParams,
  newParams: Record<string, string>,
) {
  const newSearchParams = new URLSearchParams(params.toString());
  for (const [key, value] of Object.entries(newParams)) {
    newSearchParams.set(key, value);
  }
  return newSearchParams;
}
