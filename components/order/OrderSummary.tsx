"use client";

import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";
import { WhatsAppButton } from "./WhatsAppButton";

export function OrderSummary({
  formId,
  isSubmitting,
}: {
  formId: string;
  isSubmitting: boolean;
}) {
  const { items, subtotal } = usePetti();

  return (
    <div className="lg:col-span-5">
      <div className="sticky top-24 bg-primary-container text-surface-lowest p-space-lg rounded-2xl shadow-xl space-y-space-md">
        <div className="flex items-center justify-between border-b border-on-primary-fixed-variant/40 pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
              Hamper Manifest
            </span>
            <h3 className="font-headline-md text-headline-md text-surface-bright">
              Your Custom Petti
            </h3>
          </div>
          <span className="bg-secondary text-on-secondary px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold tracking-wide">
            {items.length === 0
              ? "0 Items"
              : `${items.reduce((sum, i) => sum + i.quantity, 0)} ${
                  items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? "Item" : "Items"
                }`}
          </span>
        </div>

        <div className="space-y-space-xs max-h-56 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim py-2 italic">
              Your petti is empty. Add harvest favourites above!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}::${item.variantId}`}
                className="flex items-center justify-between py-1.5 border-b border-on-primary-fixed-variant/20 text-body-sm font-body-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                  <div>
                    <span className="text-surface-bright font-semibold">{item.productName}</span>
                    <span className="text-secondary-fixed-dim font-mono text-label-sm ml-1">
                      ({item.variantValue})
                    </span>
                  </div>
                </div>
                <div className="text-surface-bright">
                  <span className="text-tertiary-fixed-dim mr-2">×{item.quantity}</span>
                  <span className="font-bold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-space-sm border-t border-on-primary-fixed-variant/40 space-y-space-xs font-body-sm text-body-sm">
          <div className="flex justify-between text-tertiary-fixed-dim">
            <span>Hamper Harvest Subtotal</span>
            <span className="font-semibold text-surface-bright">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-headline-sm font-headline-sm font-bold text-surface-lowest pt-space-xs border-t border-on-primary-fixed-variant/30">
            <span>Estimated Total</span>
            <span className="text-secondary-fixed">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <WhatsAppButton form={formId} disabled={items.length === 0} loading={isSubmitting} />
        <p className="text-center font-label-sm text-label-sm text-tertiary-fixed-dim">
          Instant quote confirmation with Frudex concierge within 5 mins.
        </p>
      </div>
    </div>
  );
}
