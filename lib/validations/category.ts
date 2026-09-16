import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  image_url: z.string().url().nullable().optional(),
  cloudinary_public_id: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
