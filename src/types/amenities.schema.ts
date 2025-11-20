import { z } from "zod";

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

export const amenitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
}) satisfies z.ZodType<TAmenityInsert>;

export type AmenityFormValues = z.infer<typeof amenitySchema>;