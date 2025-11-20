// stripeTypes.ts
export type CreateCheckoutSessionRequest = {
  amount: number;
  bookingId: number;
};

export type CreateCheckoutSessionResponse = {
  url: string;
  sessionId: string;
};

export type WebhookResponse = {
  received: boolean;
};

export type StripeError = {
  status: number;
  data: {
    error: string;
    details?: string;
  };
};

export type WebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        bookingId?: string;
      };
      payment_intent?: string;
      amount_total?: number;
      payment_status?: string;
    };
  };
  created: number;
};