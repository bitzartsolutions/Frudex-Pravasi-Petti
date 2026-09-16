"use client";

import { useEffect, useState } from "react";
import type { ProductWithVariants } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Client-side fetch of products (with variants) via /api/products, for admin tables. */
export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
    fetch(`/api/products${query}`)
      .then((res) => res.json() as Promise<ApiResponse<ProductWithVariants[]>>)
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data) {
          setProducts(json.data);
        } else {
          setError(json.error ?? "Failed to load products");
        }
      })
      .catch(() => !cancelled && setError("Failed to load products"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return { products, loading, error };
}
