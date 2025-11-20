import { z } from "zod";

export const formSchema = z.object({
  roomTypeId: z.number().min(1, "Room type is required"),
  pricePerNight: z.coerce.number().min(1, "Price must be greater than 0"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isAvailable: z.boolean(),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  gallery: z.array(z.string()).min(1, "At least one gallery image required"),
  amenities: z.array(z.string()),
});

export type FormData = z.infer<typeof formSchema>;