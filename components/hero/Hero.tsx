"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { usePetti } from "@/hooks/usePetti";

const HERO_IMAGE = "/brand/Pravasi_petti.png";

export function Hero() {
  const { totalItems, openDrawer } = usePetti();

  return (
    <section className="relative bg-primary-container bg-gradient-to-b from-primary-container via-tertiary-container to-background lg:bg-none text-on-primary overflow-hidden pt-8 pb-16 lg:pb-24">
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 1440 600">
          <path
            d="M-100 200 C300 50 500 450 900 250 C1200 100 1500 400 1600 200 L1600 700 L-100 700 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-7 space-y-space-md">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-tertiary-container text-secondary-fixed text-label-sm font-label-sm tracking-widest uppercase shadow-sm">
              <Icon name="workspace_premium" className="text-secondary-fixed" size={16} />
              Heritage Harvest • Delivered Across India
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-surface-lowest leading-tight">
              BUILD YOUR <br className="hidden sm:inline" />
              <span className="text-secondary-fixed underline decoration-secondary-fixed-dim/40 decoration-wavy underline-offset-8">
                PRAVASI PETTI
              </span>
            </h1>
            <p className="font-body-lg text-body-md md:text-body-lg text-tertiary-fixed-dim max-w-xl leading-relaxed">
              Choose the favourites they&rsquo;ll love, packed with the artisanal goodness of
              Frudex — premium dates, roasted nuts, dry fruits and handcrafted chocolates,
              thoughtfully curated into your very own Pravasi Petti.
            </p>
            <div className="pt-space-xs flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
              <a
                href="#curate-grid"
                className="inline-flex items-center justify-center gap-space-sm bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-lg text-label-lg px-space-xl py-4 rounded-full shadow-md hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider font-bold"
              >
                <Icon name="package_2" size={20} />
                START BUILDING
              </a>
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex items-center justify-center gap-space-sm bg-transparent hover:bg-surface-lowest text-surface-lowest hover:text-primary font-label-lg text-label-lg px-space-xl py-4 rounded-full border-2 border-surface-lowest/50 hover:border-surface-lowest shadow-md hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider font-bold"
              >
                <Icon name="visibility" size={20} />
                View Hamper ({totalItems})
              </button>
            </div>
            <div className="pt-space-sm flex items-center flex-wrap gap-y-2 gap-x-space-md font-label-sm text-label-sm text-on-primary-container tracking-wider uppercase">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" /> Pick your
                favourites
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" /> Build your
                custom Petti
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" /> 1-Click
                WhatsApp Order
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-tertiary-container/60 p-2">
              <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[640/440] rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={HERO_IMAGE}
                  alt="Frudex team carefully packing a Pravasi Petti order"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transform hover:scale-[1.01] transition-transform duration-300"
                  priority
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-primary-container/90 backdrop-blur-md px-space-md py-space-sm rounded-xl text-surface-lowest flex flex-col items-start gap-space-xs sm:flex-row sm:items-center sm:justify-between shadow-lg">
                <div>
                  <p className="font-label-sm text-label-sm text-secondary-fixed uppercase font-bold tracking-wider">
                    Packed With Care
                  </p>
                  <p className="font-headline-sm text-headline-sm text-surface-lowest font-semibold">
                    Your Pravasi Petti
                  </p>
                </div>
                <span className="px-space-sm py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider whitespace-nowrap">
                  Freshly Sealed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
