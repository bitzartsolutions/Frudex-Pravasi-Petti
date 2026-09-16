"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Client-side fetch of categories via /api/categories, for admin tables and interactive filters. */
export function useCategories(includeInactive = false) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/categories${includeInactive ? "?includeInactive=true" : ""}`)
      .then((res) => res.json() as Promise<ApiResponse<Category[]>>)
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data) {
          setCategories(json.data);
        } else {
          setError(json.error ?? "Failed to load categories");
        }
      })
      .catch(() => !cancelled && setError("Failed to load categories"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [includeInactive]);

  return { categories, loading, error };
}
