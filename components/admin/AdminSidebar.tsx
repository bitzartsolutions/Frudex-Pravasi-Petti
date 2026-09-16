"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ClipboardList, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAdminUiStore } from "@/store/adminUiStore";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function BrandBlock() {
  return (
    <div className="px-space-sm py-space-md">
      <span className="font-headline-sm text-headline-sm font-bold text-surface-lowest">
        Frudex Admin
      </span>
      <p className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider">
        Pravasi Petti
      </p>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const ItemIcon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-space-sm px-space-md py-2.5 rounded-xl font-label-md text-label-md font-semibold transition-colors",
              isActive
                ? "bg-secondary-fixed text-on-secondary-fixed"
                : "text-tertiary-fixed-dim hover:bg-tertiary-container/60 hover:text-surface-lowest"
            )}
          >
            <ItemIcon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const isMobileNavOpen = useAdminUiStore((s) => s.isMobileNavOpen);
  const closeMobileNav = useAdminUiStore((s) => s.closeMobileNav);

  // Close the mobile drawer automatically whenever navigation completes.
  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  return (
    <>
      {/* Desktop sidebar — unchanged */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-primary-container text-surface-lowest min-h-screen p-space-md">
        <BrandBlock />
        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile nav drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-black/60 transition-opacity duration-300",
          isMobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileNav}
        aria-hidden={!isMobileNavOpen}
      >
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-72 max-w-[80vw] bg-primary-container text-surface-lowest p-space-md flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out",
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div className="flex items-center justify-between">
            <BrandBlock />
            <button
              type="button"
              onClick={closeMobileNav}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full bg-tertiary-container/70 flex items-center justify-center shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          <NavLinks pathname={pathname} onNavigate={closeMobileNav} />
        </div>
      </div>
    </>
  );
}
