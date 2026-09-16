import { create } from "zustand";

interface AdminUiState {
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
}

/** Shared open/close state for the admin panel's mobile nav drawer, since
 * the trigger (AdminHeader) and the drawer (AdminSidebar) are separate
 * components composed as siblings, not parent/child. */
export const useAdminUiStore = create<AdminUiState>((set) => ({
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}));
