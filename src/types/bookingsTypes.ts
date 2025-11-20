import type { TRoom } from "./roomsTypes";


export type TBookingForm = {
  bookingId?: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string | number;
  bookingStatus: TBookingStatus;
  roomId: number;
  userId: number;
  gallery: string[];
};
export interface TSingleBooking {
  bookingId: number | undefined;
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  room: TRoom;
}

export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  role: string;
};


export type TBooking = {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string; 
  checkOutDate: string; 
  bookingStatus: TBookingStatus;
  totalAmount: string;
  createdAt: string; 
  updatedAt: string; 
  user: TUser;
  room: TRoom;
};

// types/paginationTypes.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type TBookingsResponse = Array<{
  bookingId: number;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  totalAmount: string;
  bookingStatus: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactPhone: string;
    address: string;
    role: string;
  };
  room: TRoom;
}>;

export type TBookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface BookingStatusFilterParams extends PaginationParams {
  status?: TBookingStatus[];
}
