"use client";

import { useEffect, useState } from "react";
import { usePettiStore } from "@/store/pettiStore";

/**
 * Reads the Petti store with SSR-safe hydration: the persisted cart lives
 * in localStorage, so the first client render must match the server's
 * empty render before swapping in the real, possibly-non-empty state.
 * Every component that displays cart counts/totals should go through this
 * hook instead of reading usePettiStore directly.
 */
export function usePetti() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const items = usePettiStore((s) => s.items);
  const addItem = usePettiStore((s) => s.addItem);
  const removeItem = usePettiStore((s) => s.removeItem);
  const updateQuantity = usePettiStore((s) => s.updateQuantity);
  const clear = usePettiStore((s) => s.clear);
  const isDrawerOpen = usePettiStore((s) => s.isDrawerOpen);
  const openDrawer = usePettiStore((s) => s.openDrawer);
  const closeDrawer = usePettiStore((s) => s.closeDrawer);

  const safeItems = hasMounted ? items : [];
  const totalItems = safeItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = safeItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return {
    items: safeItems,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    hasMounted,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  };
}
