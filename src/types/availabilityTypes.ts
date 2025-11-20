import type { TRoom } from "./roomsTypes";

export interface AvailabilityResponse {
  success: boolean;
  message?: string;
  data: TRoom[];
}


export interface AvailabilityParams {
  checkInDate: string;   // Format: 'YYYY-MM-DD'
  checkOutDate: string;  // Format: 'YYYY-MM-DD'
  capacity?: number;     // Optional
}