import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { getActiveProductsWithVariants } from "@/lib/data/storefront";
import { productSchema } from "@/lib/validations/product";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// Reads from Supabase on every request — never attempt static
// generation/caching for this route.
export const dynamic = "force-dynamic";

// GET /api/products                  -> active products, public
// GET /api/products?category=<slug>  -> active products in a category, public
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const products = await getActiveProductsWithVariants(category);
  return apiSuccess(products);
}

// POST /api/products -> create a product with its variants and gallery images, admin only
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid product data", 422);
  }

  const { variants, images, ...productFields } = parsed.data;
  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(productFields)
    .select()
    .single();

  if (productError || !product) {
    return apiError(productError?.message ?? "Failed to create product", 500);
  }

  const { data: insertedVariants, error: variantError } = await supabase
    .from("product_variants")
    .insert(variants.map((v) => ({ ...v, product_id: product.id })))
    .select();

  if (variantError) {
    // Compensate: don't leave a product with no variants behind.
    await supabase.from("products").delete().eq("id", product.id);
    return apiError(variantError.message, 500);
  }

  let insertedImages: unknown[] = [];
  if (images.length > 0) {
    const { data, error: imageError } = await supabase
      .from("product_images")
      .insert(images.map((img) => ({ ...img, product_id: product.id })))
      .select();

    if (imageError) {
      await supabase.from("products").delete().eq("id", product.id);
      return apiError(imageError.message, 500);
    }
    insertedImages = data ?? [];
  }

  return apiSuccess(
    { ...product, variants: insertedVariants ?? [], images: insertedImages },
    201
  );
}

// PATCH /api/products?id=<uuid> -> update a product, replace its variants and gallery images, admin only
export async function PATCH(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("Missing product id", 400);

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid product data", 422);
  }

  const { variants, images, ...productFields } = parsed.data;
  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .update(productFields)
    .eq("id", id)
    .select()
    .single();

  if (productError || !product) {
    return apiError(productError?.message ?? "Failed to update product", 500);
  }

  const keepVariantIds = variants.filter((v) => v.id).map((v) => v.id as string);
  const NIL = "00000000-0000-0000-0000-000000000000";

  const { error: deleteVariantsError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id)
    .not("id", "in", `(${keepVariantIds.length > 0 ? keepVariantIds.join(",") : NIL})`);

  if (deleteVariantsError) return apiError(deleteVariantsError.message, 500);

  const { data: upsertedVariants, error: variantError } = await supabase
    .from("product_variants")
    .upsert(
      variants.map((v) => ({ ...v, product_id: id })),
      { onConflict: "id" }
    )
    .select();

  if (variantError) return apiError(variantError.message, 500);

  const keepImageIds = images.filter((img) => img.id).map((img) => img.id as string);

  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id)
    .not("id", "in", `(${keepImageIds.length > 0 ? keepImageIds.join(",") : NIL})`);

  if (deleteImagesError) return apiError(deleteImagesError.message, 500);

  let upsertedImages: unknown[] = [];
  if (images.length > 0) {
    const { data, error: imageError } = await supabase
      .from("product_images")
      .upsert(
        images.map((img) => ({ ...img, product_id: id })),
        { onConflict: "id" }
      )
      .select();

    if (imageError) return apiError(imageError.message, 500);
    upsertedImages = data ?? [];
  }

  return apiSuccess({ ...product, variants: upsertedVariants ?? [], images: upsertedImages });
}

// DELETE /api/products?id=<uuid> -> delete a product (variants + images cascade), admin only.
// Blocked while the product is part of an order that hasn't been completed
// or cancelled yet — order_items snapshots everything needed to render
// finished order history, so once every order touching this product is
// COMPLETED/CANCELLED there's nothing left that still needs the live row.
export async function DELETE(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("Missing product id", 400);

  const supabase = await createClient();

  const { data: activeOrderItems, error: checkError } = await supabase
    .from("order_items")
    .select("order_id, orders!inner(status)")
    .eq("product_id", id)
    .in("orders.status", ["PENDING", "CONFIRMED", "PROCESSING"]);

  if (checkError) return apiError(checkError.message, 500);
  if (activeOrderItems && activeOrderItems.length > 0) {
    return apiError(
      "This product is in an order that isn't completed or cancelled yet. Finish or cancel that order first, then delete it.",
      409
    );
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return apiError(error.message, 500);
  return apiSuccess({ id });
}
