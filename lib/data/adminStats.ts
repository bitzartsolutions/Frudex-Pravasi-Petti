import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    totalProducts,
    activeProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    completedOrders,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "COMPLETED"),
  ]);

  return {
    totalProducts: totalProducts.count ?? 0,
    activeProducts: activeProducts.count ?? 0,
    totalCategories: totalCategories.count ?? 0,
    totalOrders: totalOrders.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    completedOrders: completedOrders.count ?? 0,
  };
}
