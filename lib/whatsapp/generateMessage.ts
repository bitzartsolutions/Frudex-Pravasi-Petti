import { formatCurrency } from "@/lib/utils/currency";
import type { Order, OrderItem } from "@/types/order";

/**
 * Builds the WhatsApp order manifest text from server-persisted order data.
 * Called only after the order + order_items have been written with
 * server-calculated prices — never from client-held cart state.
 */
export function generateWhatsAppMessage(order: Order, items: OrderItem[]): string {
  const lines: string[] = [];

  lines.push("*FRUDEX PRAVASI PETTI ORDER*");
  lines.push(`*Order Ref:* ${order.order_number}`);
  lines.push("----------------------------------------");
  lines.push(`*Name:* ${order.customer_name}`);
  lines.push(`*WhatsApp:* ${order.whatsapp_number}`);
  lines.push(`*Delivery Location:* ${order.delivery_location}`);
  if (order.customer_message) {
    lines.push(`*Message:* "${order.customer_message}"`);
  }
  lines.push("----------------------------------------");
  lines.push("*PRODUCTS:*");

  items.forEach((item, idx) => {
    const variantLabel = item.variant_value ? ` (${item.variant_value})` : "";
    lines.push(
      `${idx + 1}. ${item.product_name}${variantLabel} × ${item.quantity} = ${formatCurrency(
        item.total_price
      )}`
    );
  });

  lines.push("----------------------------------------");
  lines.push(`*Subtotal:* ${formatCurrency(order.subtotal)}`);
  if (order.additional_charge > 0) {
    lines.push(`*Additional Charges:* ${formatCurrency(order.additional_charge)}`);
  }
  lines.push(`*TOTAL:* ${formatCurrency(order.total)}`);
  lines.push("----------------------------------------");
  lines.push("Please confirm and share the payment link. Thank you Frudex!");

  return lines.join("\n");
}

/**
 * Builds a wa.me deep link to the Frudex business number. The number is
 * stored in the database (settings table, editable at /admin/settings) —
 * callers fetch it via lib/data and pass it in here rather than this
 * function reading an env var directly.
 */
export function buildWhatsAppUrl(message: string, whatsappNumber: string): string {
  const number = whatsappNumber.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me";
  return `${base}?text=${encodeURIComponent(message)}`;
}
