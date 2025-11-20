import z from "zod";

export const reviewSchema = z.object({
  userId: z.number(),
  bookingId: z.number(),
  rating: z.number().min(0).max(5),
  hotelId: z.number().nullable().optional(),
  roomId: z.number().nullable().optional(),
  comment: z.string().optional(),
});

 export const _reviewUpdateSchema = reviewSchema.partial();
export type TReviewUpdateInput = z.infer<typeof _reviewUpdateSchema>;

export type TReviewSelect = {
  reviewId: number;
  userId: number;
  bookingId: number;
  roomId: number | null;
  hotelId: number | null;
  rating: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TReviewInsert = {
  reviewId?: number;
  userId: number;
  bookingId: number;
  roomId?: number | null;
  hotelId?: number | null;
  rating: string;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReviewsResponse = TReviewSelect[];
export type ReviewResponse = TReviewSelect;
export type ReviewsByRoomTypeResponse = TReviewSelect[];

export const validateReviewUpdate = (data: unknown): TReviewUpdateInput => {
  return _reviewUpdateSchema.parse(data);
};