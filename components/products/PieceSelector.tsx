"use client";

import { VariantSelector, type VariantOption } from "./VariantSelector";

/**
 * Piece-count variant picker — labelled "Select Box Count:" per the Stitch
 * design. Options must always carry an explicit "PCS" suffix (see
 * types/variant.ts formatVariantLabel) — never a bare number.
 */
export function PieceSelector({
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
      label="Select Box Count:"
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
