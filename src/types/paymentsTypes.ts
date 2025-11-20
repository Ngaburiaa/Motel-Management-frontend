export type TPaymentStatus = 'Pending' | 'Completed' | 'Failed';
export type TPaymentMethod = 'Card' | 'Mpesa';

export type TPayment = {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentStatus: TPaymentStatus;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
};

export interface TPaymentResponse {
  data: TPaymentSelect;
  success: boolean;
  message: string;
}

export interface TPaymentSelect {
  paymentId: number;
  bookingId: number;
  amount: string;
  paymentStatus: TPaymentStatus;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  booking: {
    bookingId: number;
    userId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: string;
    bookingStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}
