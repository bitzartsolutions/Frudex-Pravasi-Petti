import type { ProductVariant } from "./variant";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  cloudinary_public_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;

/** An additional gallery photo beyond the product's single cover image. */
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  cloudinary_public_id: string | null;
  display_order: number;
  created_at: string;
}

export type ProductImageInsert = Omit<ProductImage, "id" | "created_at">;

/** Product joined with its available variants, gallery images and category name, as served to the customer site. */
export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
  category_name?: string;
  category_slug?: string;
}
