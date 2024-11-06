import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@limelight/shared-ui-kit/ui/card';
import PaymentContainer from '../_components/PaymentOptions';
import { api } from '../../../../trpc/server';
import SavedCard from '../_components/SavedCard';

export default async function PaymentSettingsPage() {
  const { clientSecret, defaultPaymentMethod, card } =
    await api.stripe.getStripeCustomer.query();

  if (!clientSecret) {
    return null;
  }

  return (
    <Card className="flex-grow col-span-4">
      <CardHeader className="pb-0 px-4 pt-4 space-y-0">
        <CardTitle className="text-xl">Payment settings</CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-4">
        {card ? (
          <SavedCard
            card={card}
            defaultPaymentMethod={defaultPaymentMethod as string}
          />
        ) : (
          <PaymentContainer clientSecret={clientSecret} />
        )}
      </CardContent>
    </Card>
  );
}
