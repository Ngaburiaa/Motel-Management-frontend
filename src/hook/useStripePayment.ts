import { useCreateCheckoutSessionMutation } from "../features/api/stripeApi";
import type { StripeError } from "../types/stripeTypes";

type UseStripePaymentReturn = {
  initiatePayment: (bookingId: number, amount: number) => Promise<{
    url: string | null;
    error?: string;
    sessionId?: string;
  }>;
  isLoading: boolean;
  error: StripeError | null;
  checkoutUrl: string | undefined;
};

export const useStripePayment = (): UseStripePaymentReturn => {
  const [createCheckoutSession, { isLoading, error, data }] = useCreateCheckoutSessionMutation();

  const initiatePayment = async (
    bookingId: number, 
    amount: number
  ): Promise<{
    url: string | null;
    error?: string;
    sessionId?: string;
  }> => {
    try {
      const result = await createCheckoutSession({ bookingId, amount });
      
      if ('error' in result) {
        return {
          url: null,
          error: result.error as string || 'Unknown error occurred'
        };
      }

      if (result.data) {
        return {
          url: result.data.url || null,
          sessionId: result.data.sessionId
        };
      }

      return {
        url: null,
        error: 'No data received from server'
      };
    } catch (err) {
      console.error('Payment initiation failed:', err);
      return {
        url: null,
        error: err instanceof Error ? err.message : 'Payment initiation failed'
      };
    }
  };

  return {
    initiatePayment,
    isLoading,
    error: error as StripeError | null,
    checkoutUrl: data?.url,
  };
};