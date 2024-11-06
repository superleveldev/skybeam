import SideNav, { SideNavFallback } from '../../_components/SideNav';
import CampaignSummary, {
  CampaignSummaryFallback,
} from '../../_components/CampaignSummary/CampaignSummary';
import TargetSummary from '../../_components/CampaignSummary/TargetSummary';
import ActivationConfirmation from '../../_components/CampaignSummary/ActivationConfirmation';
import { Suspense } from 'react';
import SummaryPaymentContainer from './SummaryPaymentContainer';

export default async function CampaignSummaryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { c?: string };
}) {
  const { id } = params;

  return (
    <>
      <main className="grid grid-cols-9 pb-6">
        <Suspense fallback={<SideNavFallback />}>
          <SideNav step="summary" campaignId={id} />
        </Suspense>
        <section className="col-span-9 lg:col-span-5 flex w-full flex-1 flex-col items-start justify-start space-y-6">
          <h3 className="font-bold text-left text-lg w-full">
            Campaign Summary
          </h3>
          <Suspense fallback={<CampaignSummaryFallback />}>
            <CampaignSummary campaignId={id} />
          </Suspense>
          <Suspense fallback={<CampaignSummaryFallback />}>
            <TargetSummary campaignId={id} />
          </Suspense>
          <Suspense fallback={<CampaignSummaryFallback />}>
            <SummaryPaymentContainer campaignId={id} />
          </Suspense>
        </section>
      </main>
      {searchParams.c === 'true' && <ActivationConfirmation campaignId={id} />}
    </>
  );
}
