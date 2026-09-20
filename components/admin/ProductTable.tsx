"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import type { ProductWithVariants } from "@/types/product";

export function ProductTable({ products }: { products: ProductWithVariants[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        alert(json.error ?? "Failed to delete product");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <p className="font-body-sm text-body-sm text-on-surface-variant py-space-lg text-center">
        No products yet. Create your first one to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-variant/60">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low">
          <tr className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
            <th className="px-space-md py-space-sm">Product</th>
            <th className="px-space-md py-space-sm">Category</th>
            <th className="px-space-md py-space-sm">Price Range</th>
            <th className="px-space-md py-space-sm">Status</th>
            <th className="px-space-md py-space-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/40">
          {products.map((product) => {
            const prices = product.variants.map((v) => v.price);
            const min = prices.length ? Math.min(...prices) : 0;
            const max = prices.length ? Math.max(...prices) : 0;

            return (
              <tr key={product.id} className="font-body-sm text-body-sm">
                <td className="px-space-md py-space-sm">
                  <div className="flex items-center gap-2">
                    {product.is_featured ? (
                      <Star size={14} className="text-secondary fill-secondary" />
                    ) : null}
                    <span className="font-semibold text-primary">{product.name}</span>
                  </div>
                </td>
                <td className="px-space-md py-space-sm text-on-surface-variant">
                  {product.category_name ?? "—"}
                </td>
                <td className="px-space-md py-space-sm text-on-surface-variant">
                  {min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`}
                </td>
                <td className="px-space-md py-space-sm">
                  <Badge className={product.is_active ? "bg-secondary text-on-secondary" : undefined}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-space-md py-space-sm">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg hover:bg-surface-container text-primary"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-lg hover:bg-error-container text-error disabled:opacity-50"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
