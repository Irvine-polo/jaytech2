import React, { useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import type { PaymentIntent, StripeError } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';

interface PaymentFormProps {
  amount: number;
  open: boolean; // receive from parent
  onOpenChange: (open: boolean) => void; // control from parent
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  open,
  onOpenChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await (stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    }) as Promise<{
      error?: StripeError;
      paymentIntent?: PaymentIntent;
      setupIntent?: unknown;
    }>);

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent) {
      const pi = result.paymentIntent;
      if (pi.status === 'succeeded') {
        toast.success('Payment successful!');
        onOpenChange(false);
      } else {
        toast.error(`Payment failed. Status: ${pi.status}`);
      }
    } else {
      toast.error('Payment failed.');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent autoFocus>
        <form onSubmit={handleSubmit}>
          <DialogHeader>Confirm Payment</DialogHeader>
          <DialogBody>
            <PaymentElement />
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || loading}>
              {loading ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
