'use client';

import { Card, CardContent } from '@limelight/shared-ui-kit/ui/card';
import { FaCcVisa, FaCcAmex, FaCcMastercard } from 'react-icons/fa';
import { deletePaymentMethod } from '../../../../server/actions';
import { Button } from '@limelight/shared-ui-kit/ui/button';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const brands = {
  amex: <FaCcAmex className="size-4" />,
  visa: <FaCcVisa className="size-4" />,
  mastercard: <FaCcMastercard className="size-4" />,
};

export default function SavedCard({
  defaultPaymentMethod,
  card,
}: {
  defaultPaymentMethod: string;
  card: {
    brand: string;
    last4: string;
    exp: string;
  };
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      deletePaymentMethod(defaultPaymentMethod);
      toast.success('Card deleted');
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  return (
    <>
      <p>Your saved card</p>
      <Card className="w-fit my-3 mt-1">
        <CardContent className="card-body px-3 py-2">
          {isLoading ? (
            <div className="flex justify-center items-center w-[174px] h-[80px]">
              <div className="animate-spin">
                <RefreshCw className="size-6 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClick}
                  className="btn btn-link text-decoration-none size-4 p-0"
                >
                  &times;
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="">
                  {brands[card.brand as keyof typeof brands]}
                </div>
                <div className="col">**** **** **** {card.last4}</div>
              </div>
              <div className="flex justify-between">
                <div>exp.</div>
                <div className="col-auto">{card.exp}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
