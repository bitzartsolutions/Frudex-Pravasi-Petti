"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/types/category";

export function CategoryTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Products in this category will need reassigning.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        alert(
          json.error?.includes("foreign key")
            ? "This category still has products in it — move or delete them first."
            : json.error ?? "Failed to delete category"
        );
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (categories.length === 0) {
    return (
      <p className="font-body-sm text-body-sm text-on-surface-variant py-space-lg text-center">
        No categories yet. Create your first one to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-variant/60">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low">
          <tr className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
            <th className="px-space-md py-space-sm">Category</th>
            <th className="px-space-md py-space-sm">Order</th>
            <th className="px-space-md py-space-sm">Status</th>
            <th className="px-space-md py-space-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/40">
          {categories.map((category) => (
            <tr key={category.id} className="font-body-sm text-body-sm">
              <td className="px-space-md py-space-sm font-semibold text-primary">
                {category.name}
              </td>
              <td className="px-space-md py-space-sm text-on-surface-variant">
                {category.display_order}
              </td>
              <td className="px-space-md py-space-sm">
                <Badge className={category.is_active ? "bg-secondary text-on-secondary" : undefined}>
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-space-md py-space-sm">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="p-2 rounded-lg hover:bg-surface-container text-primary"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === category.id}
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 rounded-lg hover:bg-error-container text-error disabled:opacity-50"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
