import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { createOrderSchema, orderStatusSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils/format";
import { generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp/generateMessage";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import type { Order, OrderItem } from "@/types/order";

// Reads/writes Supabase on every request — never attempt static
// generation/caching for this route.
export const dynamic = "force-dynamic";

// GET /api/orders?status=<status> -> list orders, admin only
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const supabase = createAdminClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return apiError(error.message, 500);
  return apiSuccess(data ?? []);
}

// POST /api/orders -> place an order, public.
// Prices are NEVER trusted from the client: only productId/variantId/quantity
// are read from the request body, and every price is re-derived from the
// database here before the order and its line items are persisted.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid order data", 422);
  }

  const { customerName, whatsappNumber, deliveryLocation, customerMessage, items } = parsed.data;
  const supabase = createAdminClient();

  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, variant_type, variant_value, price, is_available, products(name, is_active)")
    .in("id", variantIds);

  if (variantsError) return apiError(variantsError.message, 500);

  const variantMap = new Map((variants ?? []).map((v) => [v.id, v]));

  const orderItemsInput: Array<Omit<OrderItem, "id" | "order_id" | "created_at">> = [];
  let subtotal = 0;

  for (const line of items) {
    const variant = variantMap.get(line.variantId);
    const product = variant?.products as { name: string; is_active: boolean } | null;

    if (!variant || variant.product_id !== line.productId) {
      return apiError("One of the items in your Petti is no longer available.", 409);
    }
    if (!variant.is_available || !product?.is_active) {
      return apiError(`${product?.name ?? "An item"} is currently unavailable.`, 409);
    }

    const totalPrice = variant.price * line.quantity;
    subtotal += totalPrice;

    orderItemsInput.push({
      product_id: line.productId,
      variant_id: variant.id,
      product_name: product.name,
      variant_type: variant.variant_type,
      variant_value: variant.variant_value,
      unit_price: variant.price,
      quantity: line.quantity,
      total_price: totalPrice,
    });
  }

  // No delivery/packaging charge logic yet — pricing not finalized. Not
  // "complimentary"; just not implemented. Revisit once a real delivery
  // fee structure is decided.
  const additionalCharge = 0;
  const total = subtotal + additionalCharge;

  let order: Order | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        customer_name: customerName,
        whatsapp_number: whatsappNumber,
        delivery_location: deliveryLocation,
        customer_message: customerMessage || null,
        subtotal,
        additional_charge: additionalCharge,
        total,
        status: "PENDING",
      })
      .select()
      .single();

    if (data) {
      order = data as Order;
    } else {
      lastError = error?.message ?? "Failed to create order";
    }
  }

  if (!order) return apiError(lastError ?? "Failed to create order", 500);

  const { data: insertedItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsInput.map((item) => ({ ...item, order_id: order!.id })))
    .select();

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return apiError(itemsError.message, 500);
  }

  const { data: settings } = await supabase
    .from("settings")
    .select("whatsapp_number")
    .eq("id", "default")
    .single();

  const message = generateWhatsAppMessage(order, insertedItems as OrderItem[]);
  const whatsappUrl = buildWhatsAppUrl(message, settings?.whatsapp_number ?? "");

  return apiSuccess({ orderNumber: order.order_number, whatsappUrl }, 201);
}

// PATCH /api/orders?id=<uuid> -> update order status, admin only
export async function PATCH(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return apiError("Missing order id", 400);

  const body = await request.json().catch(() => null);
  const statusResult = orderStatusSchema.safeParse(body?.status);
  if (!statusResult.success) return apiError("Invalid order status", 422);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status: statusResult.data })
    .eq("id", id)
    .select()
    .single();

  if (error) return apiError(error.message, 500);
  return apiSuccess(data);
}
