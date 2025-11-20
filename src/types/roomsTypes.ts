export type TRoomType = {
  roomTypeId: number;
  name: string; 
  description: string;
  createdAt: string;
};

export type TRoom = {
  roomId: number;
  hotelId: number;
  roomType: TRoomType;
  thumbnail: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities?: number[]; // Changed from string[] to number[]
  isAvailable: boolean;
  createdAt?: string;
  gallery: string[];
};

export type TRoomWithAmenities = {
  room: TRoom;
  amenities: TRoomAmenity[];
  entityAmenities: TRoomEntityAmenity[];
};

export type TRoomAmenity = {
  amenityId: number;
  name: string;
  description: string;
  icon: string;
  createdAt: string | Date;
};

export type TRoomEntityAmenity = {
  id: number;
  amenityId: number;
  entityId: number;
  entityType: "room";
  createdAt: string | Date;
};


// types/roomsTypes.ts

// Base room type from schema
export type TRoomTypeSelect = {
  roomTypeId: number;
  name: string;
  description: string | null;
  createdAt: Date;
};

export type TRoomTypeInsert = {
  roomTypeId?: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
};

// Amenity types from schema
export type TAmenitySelect = {
  amenityId: number;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
};

export type TAmenityInsert = {
  amenityId?: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  createdAt?: Date;
};

// Room types from schema
export type TRoomSelect = {
  roomId: number;
  hotelId: number | null;
  roomTypeId: number | null;
  pricePerNight: string;
  capacity: number;
  thumbnail: string | null;
  description: string | null;
  gallery: string[] | null;
  isAvailable: boolean;
  createdAt: Date;
  roomType?: TRoomTypeSelect;
};

export type TRoomInsert = {
  roomId?: number;
  hotelId?: number | null;
  roomTypeId?: number | null;
  pricePerNight: string;
  capacity: number;
  thumbnail?: string | null;
  description?: string | null;
  gallery?: string[] | null;
  isAvailable?: boolean;
  createdAt?: Date;
};

// Extended types for forms and API responses
export type TEditRoomForm = {
  roomId: number;
  roomTypeId: number;
  pricePerNight: number;
  capacity: number;
  thumbnail: string;
  description: string;
  gallery: string[];
  amenities: number[]; // Changed from string[] to number[]
  isAvailable: boolean;
};



// API response types
export type TRoomResponse = TRoomSelect;
export type TRoomsResponse = TRoomSelect[];
export type TRoomWithAmenitiesResponse = TRoomWithAmenities;

// Form types
export type TRoomFormValues = {
  roomTypeId: number;
  pricePerNight: string;
  capacity: number;
  thumbnail: string;
  description: string;
  gallery: string[];
  amenities: number[];
  isAvailable: boolean;
};

// Component props
export type EditRoomPageProps = {
  room: TEditRoomForm;
  onSubmit: (data: TEditRoomForm) => void;
  isLoading?: boolean;
  onCancel?: () => void;
};

export type RoomDetailsProps = {
  roomId: number;
};

// API mutation types
export type TCreateRoomRequest = Omit<TRoomInsert, 'roomId' | 'createdAt'> & {
  amenities: number[];
};

export type TUpdateRoomRequest = Partial<TRoomInsert> & {
  roomId: number;
  amenities?: number[];
};

export type TDeleteRoomResponse = {
  success: boolean;
  id: number;
};

// Query params
export type TGetRoomsParams = {
  hotelId?: number;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
};