export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  cloudinary_public_id: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type CategoryInsert = Omit<Category, "id" | "created_at" | "updated_at">;
export type CategoryUpdate = Partial<CategoryInsert>;
