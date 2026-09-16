"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import type { ProductFormValues } from "@/lib/validations/product";

const VARIANT_TYPES = [
  { value: "weight", label: "Weight" },
  { value: "pieces", label: "Pieces" },
  { value: "pack", label: "Pack" },
  { value: "size", label: "Size" },
];

/** Repeatable variant row editor, e.g. 100g/₹190, 250g/₹450, 12 PCS/₹650. */
export function VariantForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  return (
    <div className="space-y-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md font-semibold text-primary">Variants</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              variant_type: "weight",
              variant_value: "",
              price: 0,
              is_available: true,
              display_order: fields.length,
            })
          }
        >
          <Plus size={14} /> Add Variant
        </Button>
      </div>

      {errors.variants?.message ? (
        <p className="text-error text-label-sm font-label-sm">{errors.variants.message}</p>
      ) : null}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-start p-space-sm bg-surface-container-low rounded-xl"
          >
            <Select {...register(`variants.${index}.variant_type` as const)}>
              {VARIANT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <div>
              <Input
                placeholder="e.g. 250g or 12"
                error={!!errors.variants?.[index]?.variant_value}
                {...register(`variants.${index}.variant_value` as const)}
              />
            </div>
            <div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Price"
                error={!!errors.variants?.[index]?.price}
                {...register(`variants.${index}.price` as const, { valueAsNumber: true })}
              />
            </div>
            <label className="flex items-center gap-2 px-space-sm py-3 whitespace-nowrap">
              <Checkbox {...register(`variants.${index}.is_available` as const)} />
              <span className="font-label-sm text-label-sm">Available</span>
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-3 text-error hover:bg-error-container rounded-xl"
              aria-label="Remove variant"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
