"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";
import type { PettiItem as PettiItemType } from "@/store/pettiStore";

export function PettiItem({ item }: { item: PettiItemType }) {
  const { updateQuantity, removeItem } = usePetti();

  return (
    <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between gap-space-sm shadow-sm">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.productName}
          width={56}
          height={56}
          className="w-14 h-14 rounded-lg object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-surface-container" />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-label-md text-label-md font-bold text-primary truncate">
          {item.productName}
        </h4>
        <p className="font-label-sm text-label-sm text-secondary font-semibold">
          {item.variantValue} • {formatCurrency(item.unitPrice)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center bg-surface-container-lowest rounded-full p-0.5 shadow-xs">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold hover:bg-surface-variant text-xs"
          >
            <Icon name="remove" size={14} />
          </button>
          <span className="w-6 text-center font-label-sm text-label-sm font-bold text-primary">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-primary font-bold hover:bg-surface-variant text-xs"
          >
            <Icon name="add" size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-outline hover:text-error transition-colors p-1"
          title="Remove item"
        >
          <Icon name="delete" size={18} />
        </button>
      </div>
    </div>
  );
}
