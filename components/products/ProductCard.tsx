"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { WeightSelector } from "./WeightSelector";
import { PieceSelector } from "./PieceSelector";
import { QuantitySelector } from "./QuantitySelector";
import { ProductGallery } from "./ProductGallery";
import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";
import { formatVariantLabel } from "@/types/variant";
import type { ProductWithVariants } from "@/types/product";
import type { VariantOption } from "./VariantSelector";

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const { addItem } = usePetti();

  const sortedVariants = useMemo(
    () => [...product.variants].sort((a, b) => a.display_order - b.display_order),
    [product.variants]
  );

  const defaultVariant =
    sortedVariants.find((v) => v.is_available) ?? sortedVariants[0] ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const galleryImages = useMemo(() => {
    const sortedExtra = [...product.images]
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url);
    return product.image_url ? [product.image_url, ...sortedExtra] : sortedExtra;
  }, [product.image_url, product.images]);

  const selectedVariant =
    sortedVariants.find((v) => v.id === selectedVariantId) ?? defaultVariant;

  const options: VariantOption[] = sortedVariants.map((v) => ({
    id: v.id,
    label: formatVariantLabel(v),
    price: v.price,
    isAvailable: v.is_available,
  }));

  const isPieceProduct = sortedVariants[0]?.variant_type === "pieces";
  const hasChoice = sortedVariants.length > 1;

  function handleAdd() {
    if (!selectedVariant) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        variantType: selectedVariant.variant_type,
        variantValue: formatVariantLabel(selectedVariant),
        unitPrice: selectedVariant.price,
        imageUrl: product.image_url,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <div
      className="product-card bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      data-category={product.category_slug}
      data-product-id={product.id}
    >
      <div>
        <button
          type="button"
          onClick={() => galleryImages.length > 0 && setGalleryOpen(true)}
          disabled={galleryImages.length === 0}
          aria-label={`View photos of ${product.name}`}
          className="relative aspect-[4/3] w-full bg-surface-container-low overflow-hidden block disabled:cursor-default"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transform hover:scale-105 transition-transform duration-500"
            />
          ) : null}
          {product.category_name ? (
            <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm text-label-sm px-space-sm py-0.5 rounded-full uppercase tracking-wider font-bold">
              {product.category_name}
            </span>
          ) : null}
          {product.images.length > 0 ? (
            <span className="absolute bottom-3 right-3 bg-black/60 text-white font-label-sm text-label-sm px-space-sm py-0.5 rounded-full flex items-center gap-1">
              <Icon name="photo_library" size={14} />
              {product.images.length + 1}
            </span>
          ) : null}
        </button>
        <div className="p-space-md space-y-space-xs">
          <h3 className="font-headline-sm text-headline-sm text-primary">{product.name}</h3>
          {product.description ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {product.description}
            </p>
          ) : null}

          {hasChoice ? (
            isPieceProduct ? (
              <PieceSelector
                options={options}
                selectedId={selectedVariantId}
                onSelect={(opt) => setSelectedVariantId(opt.id)}
              />
            ) : (
              <WeightSelector
                options={options}
                selectedId={selectedVariantId}
                onSelect={(opt) => setSelectedVariantId(opt.id)}
              />
            )
          ) : selectedVariant ? (
            <div className="pt-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-outline">
                Standard Package:
              </span>
              <div className="mt-1">
                <span className="inline-block px-3 py-1 bg-surface-container text-on-surface text-label-sm font-label-sm font-semibold rounded">
                  {formatVariantLabel(selectedVariant)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-space-md pt-0">
        <div className="flex items-center justify-between py-space-xs">
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            {selectedVariant ? formatCurrency(selectedVariant.price) : "—"}
          </span>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
        </div>
        <button
          type="button"
          disabled={!selectedVariant}
          onClick={handleAdd}
          className="w-full mt-space-xs py-2.5 rounded-full bg-primary-container text-secondary-fixed hover:bg-primary font-label-md text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {justAdded ? (
            <>
              <Icon name="check" size={18} />
              ✓ ADDED
            </>
          ) : (
            <>
              <Icon name="add_box" size={18} />
              ADD TO PETTI
            </>
          )}
        </button>
      </div>

      <ProductGallery
        images={galleryImages}
        productName={product.name}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
}
