import * as z from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type NewsletterFormSchema = z.infer<typeof newsletterSchema>;
