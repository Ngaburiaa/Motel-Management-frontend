import type { TRoomType } from "./roomsTypes";

export interface TWishlistItem {
  wishlistId: number;
  userId: number;
  roomId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  room: {
    roomId: number;
    hotelId: number;
    roomType: TRoomType;
    pricePerNight: string;
    capacity: number;
    thumbnail: string;
    gallery: string[];
    isAvailable: boolean;
    createdAt: string | Date;
  };
};