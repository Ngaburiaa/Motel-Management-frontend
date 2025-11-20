import { z } from "zod";

export const bookingSchema = z.object({
  userId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  checkInDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid check-in date" }
  ),
  checkOutDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid check-out date" }
  ),
  totalAmount: z
    .string()
    .refine(
      (val) => parseFloat(val) > 0,
      { message: "Total amount must be greater than zero" }
    ),
  bookingStatus: z.enum(["Pending", "Confirmed", "Cancelled"]),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
