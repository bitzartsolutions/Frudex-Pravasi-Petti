"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { useCategories } from "@/hooks/useCategories";
import type { ProductFormValues } from "@/lib/validations/product";

export default function NewProductPage() {
  const router = useRouter();
  const { categories, loading } = useCategories(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to create product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminHeader title="New Product" />
      <div className="p-space-lg max-w-3xl">
        {error ? (
          <p className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl font-body-sm text-body-sm">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">Loading categories…</p>
        ) : (
          <ProductForm categories={categories} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    </>
  );
}
