import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { getActiveCategories } from "@/lib/data/storefront";
import { categorySchema } from "@/lib/validations/category";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// Reads from Supabase on every request — never attempt static
// generation/caching for this route (that's what caused the build to try
// prerendering it and fail when env vars weren't available at build time).
export const dynamic = "force-dynamic";

// GET /api/categories            -> active categories, public
// GET /api/categories?includeInactive=true -> all categories, admin only
export async function GET(request: NextRequest) {
  const includeInactive = request.nextUrl.searchParams.get("includeInactive") === "true";

  if (!includeInactive) {
    const categories = await getActiveCategories();
    return apiSuccess(categories);
  }

  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return apiError(error.message, 500);
  return apiSuccess(data ?? []);
}

// POST /api/categories -> create a category, admin only
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid category data", 422);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return apiError(error.message, 500);
  return apiSuccess(data, 201);
}

// PATCH /api/categories?id=<uuid> -> update a category, admin only
export async function PATCH(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("Missing category id", 400);

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid category data", 422);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message, 500);
  return apiSuccess(data);
}

// DELETE /api/categories?id=<uuid> -> delete a category, admin only
export async function DELETE(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("Missing category id", 400);

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return apiError(error.message, 500);
  return apiSuccess({ id });
}
