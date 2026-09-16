"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { usePetti } from "@/hooks/usePetti";
import { formatCurrency } from "@/lib/utils/currency";

export function Header() {
  const { totalItems, subtotal, openDrawer } = usePetti();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-primary-container text-on-primary shadow-[0_4px_20px_rgba(7,59,50,0.18)] border-b border-tertiary-fixed/20">
      <div className="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
        <Image
          src="/brand/frudex-logo-white.png"
          alt="Frudex"
          width={117}
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />

        <button
          type="button"
          onClick={openDrawer}
          aria-label="My Petti Hamper"
          className="flex items-center gap-space-sm bg-tertiary-container/80 hover:bg-tertiary-container px-space-md py-space-xs rounded-full border border-tertiary/40 transition-all"
        >
          <div className="relative flex items-center justify-center">
            <Icon name="shopping_bag" className="text-secondary-fixed" size={22} />
            <span className="absolute -top-1.5 -right-2 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-primary-container">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="font-label-sm text-label-sm tracking-wider uppercase text-tertiary-fixed-dim font-medium">
              MY PETTI
            </span>
            <span className="font-label-md text-label-md text-surface-bright font-bold">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </button>
      </div>

      <div className="w-full overflow-hidden leading-none h-[6px] text-tertiary-container/60 fill-current">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 12">
          <path
            d="M0,0 C150,9 350,-6 500,6 C650,18 900,-6 1200,3 L1200,12 L0,12 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </header>
  );
}
