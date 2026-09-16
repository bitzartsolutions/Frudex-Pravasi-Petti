export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  whatsapp_number: string;
  delivery_location: string;
  customer_message: string | null;
  subtotal: number;
  additional_charge: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_type: string | null;
  variant_value: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/** Line the client sends for order creation — never carries price. */
export interface OrderLineInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  whatsappNumber: string;
  deliveryLocation: string;
  customerMessage?: string;
  items: OrderLineInput[];
}
