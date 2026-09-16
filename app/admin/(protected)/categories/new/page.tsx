"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { CategoryFormValues } from "@/lib/validations/category";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to create category");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminHeader title="New Category" />
      <div className="p-space-lg max-w-2xl">
        {error ? (
          <p className="mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl font-body-sm text-body-sm">
            {error}
          </p>
        ) : null}
        <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </>
  );
}
