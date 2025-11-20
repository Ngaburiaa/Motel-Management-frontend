// src/validations/addressSchema.ts
import { z } from "zod";

export const addressFormSchema = z.object({
  addressId: z.number().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  entityId: z.number().optional(),
  entityType: z.literal("user"),
});

export type TAddressFormSchema = z.infer<typeof addressFormSchema>;
