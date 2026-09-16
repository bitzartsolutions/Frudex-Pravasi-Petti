"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "./CategoryForm";
import type { CategoryFormValues } from "@/lib/validations/category";
import type { Category } from "@/types/category";

export function CategoryEditClient({ category }: { category: Category }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: Partial<CategoryFormValues> = {
    name: category.name,
    slug: category.slug,
    image_url: category.image_url,
    cloudinary_public_id: category.cloudinary_public_id,
    is_active: category.is_active,
    display_order: category.display_order,
  };

  async function handleSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories?id=${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to update category");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {error ? (
        <p className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl font-body-sm text-body-sm">
          {error}
        </p>
      ) : null}
      <CategoryForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
