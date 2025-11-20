// src/types/userAnalyticsTypes.ts

// Base types for nested structures
// interface Hotel {
//   name: string;
//   thumbnail: string | null;
// }

// interface Room {
//   roomId: number;
//   hotelId: number;
//   pricePerNight: number;
//   thumbnail: string | null;
//   hotel?: Hotel;
// }

interface Payment {
  amount: number;
  paymentStatus: 'Completed' | 'Pending' | 'Failed';
  paymentDate?: string;
}

// interface Booking {
//   bookingId: number;
//   roomId: number;
//   userId: number;
//   checkInDate: string;
//   checkOutDate: string;
//   bookingStatus: string;
//   createdAt: string;
//   room?: Room;
//   payments?: Payment[];
// }

// interface Review {
//   rating: number;
// }

// interface Address {
//   city: string;
// }

// Main analytics interfaces
interface PaymentByMonth {
  month: string; // Format: "YYYY-MM"
  amount: number;
}

// interface SuggestedRoom extends Room {
//   hotel?: Hotel & {
//     addresses?: Address[];
//   };
//   reviews?: Review[];
// }

// interface UserAnalytics {
//   userId: number;
//   openTicketsCount: number;
//   totalAmountPaid: number;
//   pendingAmount: number;
//   recentBookings: Booking[];
//   paymentsByMonth: PaymentByMonth[];
//   suggestedRoom: SuggestedRoom | null;
// }

// Response wrapper types
interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

interface ApiResponseError {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

// Specific response type for the analytics endpoint
// type UserAnalyticsResponse = ApiResponse<UserAnalytics>;

// Export all types
export type {
//   UserAnalytics,
  PaymentByMonth,
//   Booking,
//   Room,
//   Hotel,
  Payment,
//   SuggestedRoom,
  ApiResponse,
//   UserAnalyticsResponse
};

// export type Hotel = {
//   name: string;
//   thumbnail?: string | null;
// };

// export type Room = {
//   hotel?: Hotel;
//   thumbnail?: string | null;
// };

// export type Booking = {
//   bookingId: number;
//   bookingStatus: string;
//   checkInDate: string;
//   checkOutDate: string;
//   room?: Room;
// };

// export type SuggestedRoom = {
//   hotel?: Hotel;
//   pricePerNight: string;
//   thumbnail?: string | null;
// };

// export type UserAnalytics = {
//   openTicketsCount: number;
//   totalAmountPaid: number; // It's a number in your payload
//   pendingAmount: number;
//   recentBookings: Booking[];
//   suggestedRoom?: SuggestedRoom;
// };


// src/types/userAnalyticsTypes.ts

export type Hotel = {
  name: string;
  thumbnail?: string | null;
};

export type Room = {
  hotel?: Hotel;
  thumbnail?: string | null;
};

export type Booking = {
  bookingId: number;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  room?: Room;
};

export type SuggestedRoom = {
  hotel?: Hotel;
  pricePerNight: string;
  thumbnail?: string | null;
};

export type UserAnalytics = {
  userId: number;
  openTicketsCount: number;
  totalAmountPaid: number;
  pendingAmount: number;
  recentBookings: Booking[];
  suggestedRoom?: SuggestedRoom | null;
};

export type UserAnalyticsResponse = {
  success: boolean;
  data: UserAnalytics;
};