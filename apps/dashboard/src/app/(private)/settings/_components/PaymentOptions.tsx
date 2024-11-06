'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  loadStripe,
  StripeElementsOptionsClientSecret,
} from '@stripe/stripe-js';
import { env } from '../../../../env';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { FormEvent, useState } from 'react';
import { Plus, RefreshCw, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@limelight/shared-ui-kit/ui/alert';
import { cn } from '@limelight/shared-utils/index';
import { addPaymentMethod } from '../../../../server/actions';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentContainer({
  clientSecret,
  redirectUrl,
  showForm,
}: {
  clientSecret: string;
  redirectUrl?: string;
  showForm?: boolean;
}) {
  const options: StripeElementsOptionsClientSecret = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        clientSecret={clientSecret}
        redirectUrl={redirectUrl}
        showForm={showForm}
      />
    </Elements>
  );
}

export function PaymentForm({
  clientSecret,
  redirectUrl,
  showForm: _showForm = false,
}: {
  clientSecret: string;
  redirectUrl?: string;
  showForm?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(_showForm);
  if (!stripe || !elements) {
    return null;
  }
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    const element = elements?.getElement('payment');
    element?.update({ readOnly: true });

    const { error } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error?.message ?? 'something went wrong');
      element?.update({ readOnly: false });
    } else {
      addPaymentMethod({ clientSecret }, redirectUrl);
    }
  };

  if (!showForm) {
    return (
      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-2">
          Payment method not set up. Add a payment to continue.
        </p>
        <Button
          variant="outline"
          className={cn('w-52 h-32', { 'pointer-events-none': isLoading })}
          onClick={() => setShowForm(true)}
        >
          {isLoading ? (
            <RefreshCw className="size-6 animate-spin" />
          ) : (
            <Plus className="size-6" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center">
            <TriangleAlert className="size-4 me-2" />
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <form className="space-y-2 w-full" onSubmit={onSubmit}>
        <PaymentElement options={{ layout: { type: 'accordion' } }} />
        <Button type="submit">
          {isLoading ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            'Save Payment Method'
          )}
        </Button>
      </form>
    </>
  );
}
