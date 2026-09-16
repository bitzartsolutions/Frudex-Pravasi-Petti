"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "./ProductForm";
import type { ProductFormValues } from "@/lib/validations/product";
import type { Category } from "@/types/category";
import type { ProductWithVariants } from "@/types/product";

export function ProductEditClient({
  product,
  categories,
}: {
  product: ProductWithVariants;
  categories: Category[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    category_id: product.category_id,
    image_url: product.image_url,
    cloudinary_public_id: product.cloudinary_public_id,
    is_active: product.is_active,
    is_featured: product.is_featured,
    display_order: product.display_order,
    variants: product.variants.map((v) => ({
      id: v.id,
      variant_type: v.variant_type,
      variant_value: v.variant_value,
      price: v.price,
      is_available: v.is_available,
      display_order: v.display_order,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      cloudinary_public_id: img.cloudinary_public_id,
      display_order: img.display_order,
    })),
  };

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to update product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {error ? (
        <p className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl font-body-sm text-body-sm">
          {error}
        </p>
      ) : null}
      <ProductForm
        categories={categories}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
