"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAdminUiStore } from "@/store/adminUiStore";

export function AdminHeader({ title }: { title: string }) {
  const router = useRouter();
  const openMobileNav = useAdminUiStore((s) => s.openMobileNav);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between gap-space-sm px-space-md sm:px-space-lg py-space-md bg-surface-container-lowest border-b border-surface-variant/60">
      <div className="flex items-center gap-space-sm min-w-0">
        <button
          type="button"
          onClick={openMobileNav}
          aria-label="Open menu"
          className="md:hidden w-9 h-9 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-headline-md text-headline-md text-primary truncate">{title}</h1>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 px-space-sm sm:px-space-md py-2 rounded-full font-label-md text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </header>
  );
}
