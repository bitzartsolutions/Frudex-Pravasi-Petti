"use client";

import { Icon } from "@/components/ui/Icon";

/** Small +/- quantity stepper used on product cards, matches Stitch's compact card stepper. */
export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center bg-surface-container rounded-full p-0.5">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-primary font-bold text-sm leading-none"
      >
        <Icon name="remove" size={16} />
      </button>
      <span className="w-7 text-center font-label-md text-label-md font-bold text-primary">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-primary font-bold text-sm leading-none"
      >
        <Icon name="add" size={16} />
      </button>
    </div>
  );
}
