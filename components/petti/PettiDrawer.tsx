"use client";

import { Icon } from "@/components/ui/Icon";
import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";
import { PettiItem } from "./PettiItem";
import { EmptyPetti } from "./EmptyPetti";

export function PettiDrawer() {
  const { items, subtotal, isDrawerOpen, closeDrawer } = usePetti();

  function proceed() {
    closeDrawer();
    document.getElementById("petti-customer-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
        isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeDrawer}
      aria-hidden={!isDrawerOpen}
    >
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-surface-container-lowest text-on-surface shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your Pravasi Petti"
      >
        <div className="p-space-md bg-primary-container text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <Icon name="package_2" className="text-secondary-fixed" size={26} />
            <div>
              <h3 className="font-headline-sm text-headline-sm text-surface-lowest">
                Your Pravasi Petti
              </h3>
              <p className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider">
                Unboxing Experience Customization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-tertiary-container text-surface-lowest flex items-center justify-center hover:bg-tertiary"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-space-md space-y-space-md">
          {items.length === 0 ? (
            <EmptyPetti />
          ) : (
            items.map((item) => (
              <PettiItem key={`${item.productId}::${item.variantId}`} item={item} />
            ))
          )}
        </div>

        <div className="p-space-md bg-surface-container-low border-t border-surface-variant/40 space-y-space-xs">
          <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-semibold text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-primary pt-1">
            <span>Total</span>
            <span className="text-secondary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={closeDrawer}
              className="py-3 px-space-md rounded-full bg-surface-container-highest hover:bg-surface-variant text-primary font-label-md text-label-md font-bold uppercase tracking-wider text-center transition-colors"
            >
              KEEP SHOPPING
            </button>
            <button
              type="button"
              onClick={proceed}
              disabled={items.length === 0}
              className="py-3 px-space-md rounded-full bg-primary text-secondary-fixed hover:bg-primary-container font-label-md text-label-md font-bold uppercase tracking-wider text-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PROCEED
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
