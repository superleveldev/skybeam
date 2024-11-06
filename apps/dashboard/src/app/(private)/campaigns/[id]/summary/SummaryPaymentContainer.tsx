import { checkValidity } from '../../../../../server/queries';
import { api } from '../../../../../trpc/server';
import PaymentContainer from '../../../settings/_components/PaymentOptions';
import CampaignSummaryButtons from '../../_components/CampaignSummary/CampaignSummaryButtons';

export default async function SummaryPaymentContainer({
  campaignId,
}: {
  campaignId: string;
}) {
  const { defaultPaymentMethod, clientSecret } =
    await api.stripe.getStripeCustomer.query();

  const { isValid, campaign } = await checkValidity({ campaignId });

  let canBeActivated = !!defaultPaymentMethod && isValid;

  if (campaign.status !== 'draft') {
    if (campaign.objective === 'retargeting') {
      canBeActivated = false;
    }
  }

  if (!defaultPaymentMethod && clientSecret) {
    return (
      <>
        <div>
          <h3 className="font-bold mb-0 text-left text-lg w-full">
            Payment Method
          </h3>
          <p className="text-left text-sm text-muted-foreground">
            Payment method required to activate campaign. Add a card below.
          </p>
        </div>

        <PaymentContainer
          clientSecret={clientSecret}
          redirectUrl={`/campaigns/${campaignId}/summary`}
          showForm
        />
      </>
    );
  }

  return (
    <CampaignSummaryButtons
      campaignId={campaignId}
      disabled={!canBeActivated}
    />
  );
}
