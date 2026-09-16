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
 *
 * Every function here catches its own errors and returns a safe empty
 * default instead of throwing. That's deliberate: these are called from
 * several independent Server Components (page.tsx, Footer, SocialLinks),
 * not just one place with a try/catch around it, and a Supabase outage or
 * a misconfigured env var (e.g. missing at build time on a fresh Vercel
 * deploy) must degrade the storefront to an empty state, never crash the
 * whole build/page.
 */

/**
 * The WhatsApp business number, stored in the database (settings table)
 * so an admin can change it from /admin/settings without touching env
 * vars or redeploying. Falls back to "" if unavailable for any reason —
 * callers treat that as "not configured".
 */
export async function getWhatsAppNumber(): Promise<string> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("settings")
      .select("whatsapp_number")
      .eq("id", "default")
      .single();

    if (error || !data) return "";
    return data.whatsapp_number;
  } catch (err) {
    console.error("getWhatsAppNumber failed:", err);
    return "";
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getActiveCategories failed:", err);
    return [];
  }
}

export async function getActiveProductsWithVariants(
  categorySlug?: string
): Promise<ProductWithVariants[]> {
  try {
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
  } catch (err) {
    console.error("getActiveProductsWithVariants failed:", err);
    return [];
  }
}
