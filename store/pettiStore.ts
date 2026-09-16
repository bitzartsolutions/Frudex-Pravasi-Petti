import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PettiItem {
  productId: string;
  variantId: string;
  productName: string;
  variantType: string;
  variantValue: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
}

interface PettiState {
  items: PettiItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<PettiItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

function lineKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

/**
 * Client-side Pravasi Petti (cart) state. Distinct variants of the same
 * product are always kept as separate line items — e.g. Almonds 250g and
 * Almonds 500g never merge. Prices shown here are for display only; the
 * server re-derives every price from Supabase when the order is placed.
 */
export const usePettiStore = create<PettiState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (item, quantity = 1) => {
        const key = lineKey(item.productId, item.variantId);
        const existing = get().items.find(
          (i) => lineKey(i.productId, i.variantId) === key
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i.productId, i.variantId) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },

      removeItem: (productId, variantId) => {
        const key = lineKey(productId, variantId);
        set({
          items: get().items.filter((i) => lineKey(i.productId, i.variantId) !== key),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        const key = lineKey(productId, variantId);
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            lineKey(i.productId, i.variantId) === key ? { ...i, quantity } : i
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "frudex-pravasi-petti",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function selectTotalItems(state: PettiState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectSubtotal(state: PettiState): number {
  return state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}
