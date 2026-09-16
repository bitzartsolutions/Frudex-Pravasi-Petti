"use client";

import { Icon } from "@/components/ui/Icon";
import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";

export function PettiBar() {
  const { totalItems, subtotal, openDrawer } = usePetti();

  return (
    <aside className="fixed bottom-0 inset-x-0 z-40 bg-primary-container text-surface-lowest shadow-[0_-4px_24px_rgba(7,59,50,0.25)] border-t border-tertiary transition-transform duration-300">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-3 flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-md">
          <div className="relative w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-secondary-fixed">
            <Icon name="inventory_2" size={22} />
            <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary w-5 h-5 rounded-full font-label-sm text-label-sm font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-bold">
              MY PRAVASI PETTI
            </div>
            <div className="font-headline-sm text-headline-sm text-surface-bright flex items-center gap-2">
              <span>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
              <span className="text-tertiary-fixed-dim">•</span>
              <span className="font-bold text-secondary-fixed">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex items-center gap-space-xs bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed px-space-md sm:px-space-lg py-2.5 rounded-full font-label-md text-label-md font-bold uppercase tracking-wider transition-all shadow-md"
        >
          <span>VIEW PETTI</span>
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>
    </aside>
  );
}
