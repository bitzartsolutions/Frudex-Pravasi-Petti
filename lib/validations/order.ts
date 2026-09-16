import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

// Collected as separate fields on the customer form (address line, city,
// state, PIN) but joined into a single `deliveryLocation` string before
// hitting the server, since `orders.delivery_location` is one TEXT column.
export const customerDetailsSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(120),
  whatsappNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp number")
    .max(20)
    .regex(/^[+\d][\d\s-]*$/, "Enter a valid phone number"),
  addressLine: z.string().trim().min(3, "Enter your villa/flat and street").max(200),
  city: z.string().trim().min(2, "Enter your city/district").max(100),
  state: z.string().trim().min(2, "Enter your state").max(100),
  pincode: z.string().trim().min(3, "Enter your PIN/postal code").max(20),
  customerMessage: z.string().trim().max(300).optional(),
});

export type CustomerDetailsFormValues = z.infer<typeof customerDetailsSchema>;

/** Joins the split address fields into the single string the server expects. */
export function formatDeliveryLocation(
  values: Pick<CustomerDetailsFormValues, "addressLine" | "city" | "state" | "pincode">
): string {
  return `${values.addressLine}, ${values.city}, ${values.state} - ${values.pincode}`;
}

export const createOrderSchema = z.object({
  customerName: customerDetailsSchema.shape.customerName,
  whatsappNumber: customerDetailsSchema.shape.whatsappNumber,
  deliveryLocation: z.string().trim().min(5, "Enter your delivery address").max(500),
  customerMessage: customerDetailsSchema.shape.customerMessage,
  items: z.array(orderLineSchema).min(1, "Your Pravasi Petti is empty"),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
]);
