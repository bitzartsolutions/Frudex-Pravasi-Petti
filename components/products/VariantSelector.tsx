"use client";

import { cn } from "@/lib/utils/cn";

export interface VariantOption {
  id: string;
  label: string;
  price: number;
  isAvailable: boolean;
}

/**
 * Generic pill-grid variant picker — the shared engine behind
 * WeightSelector and PieceSelector. Renders as a 3- or 4-column grid
 * matching the Stitch product card layout, with unavailable variants
 * shown struck-through and disabled instead of hidden.
 */
export function VariantSelector({
  label,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  options: VariantOption[];
  selectedId: string | null;
  onSelect: (option: VariantOption) => void;
}) {
  const columns = options.length >= 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="pt-space-xs">
      <span className="font-label-sm text-label-sm uppercase font-semibold text-outline">
        {label}
      </span>
      <div className={cn("grid gap-1 mt-1", columns)}>
        {options.map((option) => {
          const isActive = option.id === selectedId;
          if (!option.isAvailable) {
            return (
              <button
                key={option.id}
                type="button"
                disabled
                title="Temporarily out of stock"
                className="px-1.5 py-1 text-center rounded text-label-sm font-label-sm font-bold transition-all bg-surface-variant text-outline opacity-50 cursor-not-allowed line-through"
              >
                {option.label}
              </button>
            );
          }
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                "px-1.5 py-1 text-center rounded text-label-sm font-label-sm font-bold transition-all",
                isActive
                  ? "bg-primary-container text-secondary-fixed"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
