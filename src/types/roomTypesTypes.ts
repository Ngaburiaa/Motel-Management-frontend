import z from "zod";

// Zod schemas for validation
export const roomTypeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const updateRoomTypeSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export type RoomDetailsProps = {
  roomTypes: {
    roomTypeId: number;
    name: string;
  }[];
};

// Type definitions
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

// Response and request types
export type RoomTypeResponse = TRoomTypeSelect;
export type RoomTypesResponse = TRoomTypeSelect[];
export type CreateRoomTypeRequest = z.infer<typeof roomTypeSchema>;
export type UpdateRoomTypeRequest = z.infer<typeof updateRoomTypeSchema>;