"use client";

import { VariantSelector, type VariantOption } from "./VariantSelector";

/** Weight/pack/size variant picker — labelled "Select Weight:" per the Stitch design. */
export function WeightSelector({
  options,
  selectedId,
  onSelect,
}: {
  options: VariantOption[];
  selectedId: string | null;
  onSelect: (option: VariantOption) => void;
}) {
  return (
    <VariantSelector
      label="Select Weight:"
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
