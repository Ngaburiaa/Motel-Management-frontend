import { z } from "zod";

export const hotelFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().optional(),
  contactPhone: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  amenities: z.array(z.number()).optional(),
  gallery: z.array(z.string()).optional(),
});

export type HotelFormData = z.infer<typeof hotelFormSchema>;