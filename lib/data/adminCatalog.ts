import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/category";
import type { ProductWithVariants } from "@/types/product";
import type { Order, OrderWithItems } from "@/types/order";
import type { StoreSettings } from "@/types/settings";

/** Admin reads — unlike lib/data/storefront.ts, these include inactive rows. */

export async function getSettings(): Promise<StoreSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    // Defensive fallback — the migration seeds this row, so this should
    // only happen if the migration hasn't been run yet.
    return { id: "default", whatsapp_number: "", updated_at: new Date().toISOString() };
  }
  return data;
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllProductsWithVariants(): Promise<ProductWithVariants[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*), categories(name, slug)")
    .order("display_order", { ascending: true });

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

export async function getProductWithVariants(id: string): Promise<ProductWithVariants | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*), categories(name, slug)")
    .eq("id", id)
    .single();

  if (error) return null;

  const { product_variants, product_images, categories, ...product } = data as typeof data & {
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
  };
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    // Completed orders drop off this working list a day after they were
    // marked complete (based on `updated_at`, set by the orders_set_updated_at
    // trigger) — this only hides them here, the row and its history stay in
    // the database and the order detail page still loads by direct link.
    .or(`status.neq.COMPLETED,updated_at.gte.${oneDayAgo}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  // `status` is a free-form text column backed by a CHECK constraint in
  // Postgres; the DB row type can't express the OrderStatus union directly.
  return (data ?? []) as Order[];
}

export async function getOrderWithItems(id: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const [{ data: order, error: orderError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id).order("created_at"),
    ]);

  if (orderError || !order) return null;
  if (itemsError) throw itemsError;

  return { ...order, items: items ?? [] } as OrderWithItems;
}
