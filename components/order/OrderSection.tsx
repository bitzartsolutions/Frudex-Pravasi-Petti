"use client";

import { useState } from "react";
import { CustomerForm, CUSTOMER_FORM_ID } from "./CustomerForm";
import { OrderSummary } from "./OrderSummary";
import { OrderSuccess } from "./OrderSuccess";
import { usePetti } from "@/hooks/usePetti";
import { formatDeliveryLocation, type CustomerDetailsFormValues } from "@/lib/validations/order";

interface CreateOrderResponse {
  success: boolean;
  data?: { orderNumber: string; whatsappUrl: string };
  error?: string;
}

/**
 * Orchestrates the customer-details form and the live order summary panel.
 * Prices are never trusted from the client: this only ever sends
 * productId/variantId/quantity to the server, which re-derives every price
 * from Supabase before creating the order and building the WhatsApp link.
 */
export function OrderSection() {
  const { items, clear } = usePetti();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  async function handleSubmit(values: CustomerDetailsFormValues) {
    if (items.length === 0) {
      setError("Your Pravasi Petti is empty. Please add items before ordering.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          whatsappNumber: values.whatsappNumber,
          deliveryLocation: formatDeliveryLocation(values),
          customerMessage: values.customerMessage,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const json: CreateOrderResponse = await res.json();

      if (!json.success || !json.data) {
        setError(json.error ?? "We couldn't place your order. Please try again.");
        return;
      }

      setSuccessOrderNumber(json.data.orderNumber);
      clear();

      setTimeout(() => {
        window.open(json.data!.whatsappUrl, "_blank");
      }, 900);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-space-xl bg-surface-container-low border-t border-b border-surface-variant/40">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        {error ? (
          <div className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl font-body-sm text-body-sm">
            {error}
          </div>
        ) : null}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          <CustomerForm onSubmit={handleSubmit} />
          <OrderSummary formId={CUSTOMER_FORM_ID} isSubmitting={isSubmitting} />
        </div>
      </div>
      <OrderSuccess
        open={successOrderNumber !== null}
        orderNumber={successOrderNumber}
        onClose={() => setSuccessOrderNumber(null)}
      />
    </section>
  );
}
