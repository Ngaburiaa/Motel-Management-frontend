import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  contactPhone: z.string().min(10, "Phone must be at least 10 digits"),
  bio: z.string().optional(),
  profileImage: z.string().optional()
});

export type TUserForm = z.infer<typeof userFormSchema>;

