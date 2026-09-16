export type VariantType = "weight" | "pieces" | "pack" | "size";

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: VariantType;
  variant_value: string;
  price: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductVariantInsert = Omit<
  ProductVariant,
  "id" | "created_at" | "updated_at"
>;
export type ProductVariantUpdate = Partial<ProductVariantInsert>;

/**
 * Human-friendly label for a variant, e.g. "250g" or "12 PCS".
 * Admins store the raw value ("6", "250g"); "pieces" variants are always
 * rendered with an explicit "PCS" suffix so a bare count is never shown.
 */
export function formatVariantLabel(
  variant: Pick<ProductVariant, "variant_type" | "variant_value">
): string {
  const value = variant.variant_value.trim();
  if (variant.variant_type === "pieces" && !/pcs$/i.test(value)) {
    return `${value} PCS`;
  }
  return value;
}
