import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  variant_type: z.enum(["weight", "pieces", "pack", "size"]),
  variant_value: z.string().trim().min(1, "Value is required").max(40),
  price: z.number().positive("Price must be greater than 0"),
  is_available: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export const productImageSchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().url(),
  cloudinary_public_id: z.string().nullable().optional(),
  display_order: z.number().int().min(0).default(0),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(500).nullable().optional(),
  category_id: z.string().uuid("Select a category"),
  image_url: z.string().url().nullable().optional(),
  cloudinary_public_id: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
  images: z.array(productImageSchema).default([]),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
export type ProductImageFormValues = z.infer<typeof productImageSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
