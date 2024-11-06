import { Placeholder } from '../../../_components/placeholder';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function InsightPage({
  params,
}: {
  params: { insight: string };
}) {
  return (
    <Placeholder>
      <div className={'flex flex-col items-center justify-center h-full'}>
        <div data-test-insight>
          Insight page content for:{' '}
          <span className={'text-green-600 font-bold'}>{params.insight}</span>
        </div>
        <Link
          href={'/insights'}
          className={'flex flex-row items-center gap-2 mt-20'}
        >
          <ChevronLeft data-test-back-to-insights-btn className={'h-4 w-4'} />
          back to insights
        </Link>
      </div>
    </Placeholder>
  );
}
