import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category } from "@/types/category";
import type { ProductWithVariants } from "@/types/product";

/**
 * Shared read queries for the public storefront (customer site + the
 * GET /api/categories and GET /api/products route handlers). These use the
 * cookie-free anon client (lib/supabase/public.ts) — not
 * lib/supabase/server.ts — so the homepage can still be statically
 * generated / ISR'd instead of being forced fully dynamic by a `cookies()`
 * read it never actually needed.
 */

/**
 * The WhatsApp business number, stored in the database (settings table)
 * so an admin can change it from /admin/settings without touching env
 * vars or redeploying. Falls back to "" if the settings row is somehow
 * missing — callers treat that as "not configured".
 */
export async function getWhatsAppNumber(): Promise<string> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("settings")
    .select("whatsapp_number")
    .eq("id", "default")
    .single();

  if (error || !data) return "";
  return data.whatsapp_number;
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getActiveProductsWithVariants(
  categorySlug?: string
): Promise<ProductWithVariants[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from("products")
    .select(
      "*, product_variants(*), product_images(*), categories!inner(name, slug, is_active)"
    )
    .eq("is_active", true)
    .eq("categories.is_active", true)
    .order("display_order", { ascending: true });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { product_variants, product_images, categories, ...product } = row as typeof row & {
      product_variants: ProductWithVariants["variants"];
      product_images: ProductWithVariants["images"];
      categories: { name: string; slug: string } | null;
    };

    return {
      ...product,
      variants: [...product_variants].sort((a, b) => a.display_order - b.display_order),
      images: [...product_images].sort((a, b) => a.display_order - b.display_order),
      category_name: categories?.name,
      category_slug: categories?.slug,
    } satisfies ProductWithVariants;
  });
}
