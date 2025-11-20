// import type { TUser } from "./usersTypes";

export type THotel = {
  hotelId: number;
  name: string;
  thumbnail?: string;
  location?: string | null | undefined;
  contactPhone?: string | null;
  category?: string | null;
  rating?: number | null;
  amenities?: number[];
  gallery?: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: { 
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
};

export type THotelInsert = Omit<
  THotel,
  "hotelId" | "createdAt" | "updatedAt"
> & {
  hotelId?: number;
};

export type THotelAddress = {
  addressId: number;
  entityId: number;
  entityType: "hotel";
  street: string;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

export type THotelAmenityDetail = {
  amenityId: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  createdAt: Date;
};

export type THotelEntityAmenity = {
  id: number;
  amenityId: number;
  entityId: number;
  entityType: "hotel";
  createdAt: Date;
  amenity?: THotelAmenityDetail; // Optional nested amenity details
};

export type THotelFullDetails = {
  hotel: THotel;
  address?: THotelAddress | null;
  amenities: THotelAmenityDetail[];
  entityAmenities: THotelEntityAmenity[];
};

// Response types for API endpoints
export type HotelApiResponses = {
  getHotels: THotel[];
  getHotelById: THotel;
  createHotel: THotel;
  updateHotel: THotel;
  getHotelAddress: THotelAddress | null;
  getHotelEntityAmenities: THotelEntityAmenity[];
  getHotelAmenityDetails: THotelAmenityDetail[];
  getHotelFullDetails: THotelFullDetails;
};
