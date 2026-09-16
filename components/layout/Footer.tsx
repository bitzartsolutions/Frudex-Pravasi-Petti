import Image from "next/image";
import { SocialLinks } from "./SocialLinks";
import { getWhatsAppNumber } from "@/lib/data/storefront";

// Links to real sections/categories on the site — no placeholder names
// for collections that don't actually exist in the catalog.
const CURATIONS = [
  { label: "Dates", href: "/#curate-grid" },
  { label: "Nuts", href: "/#curate-grid" },
  { label: "Dry Fruits", href: "/#curate-grid" },
  { label: "Chocolates", href: "/#curate-grid" },
];

export async function Footer() {
  const whatsappNumber = (await getWhatsAppNumber()).replace(/\D/g, "");

  // Each link points at where that feature actually lives on the page,
  // rather than all four pointing at the same product-grid anchor.
  const DIRECT_GIFTING = [
    {
      label: "WhatsApp Instant Order",
      href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/#curate-grid",
    },
    { label: "Build Your Own Petti", href: "/#curate-grid" },
    { label: "Complimentary Gift Note", href: "/#petti-customer-form" },
  ];

  return (
    <footer className="w-full bg-primary-container text-surface-bright relative mt-auto border-t border-primary-container">
      <div className="w-full overflow-hidden leading-none h-6 text-background fill-current rotate-180 -mt-px">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 24">
          <path
            d="M0,0 C150,18 350,0 500,12 C650,24 900,0 1200,12 L1200,24 L0,24 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg mb-space-xl">
          <div className="space-y-space-sm md:col-span-2">
            <div className="flex flex-col items-start gap-space-xs">
              <Image
                src="/brand/frudex-logo-white.png"
                alt="Frudex"
                width={110}
                height={30}
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm text-headline-sm text-surface-lowest font-bold tracking-wide mt-3">
                PRAVASI PETTI
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim max-w-md">
              Artisanal harvest curation, rare spices, sun-cured dates, and confectionary gift
              hampers packaged for seamless doorstep delivery across India.
            </p>
            <SocialLinks />
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg font-bold text-secondary-fixed mb-space-sm uppercase tracking-wider">
              Curations
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-tertiary-fixed-dim">
              {CURATIONS.map((item) => (
                <li key={item.label}>
                  <a className="hover:text-surface-lowest transition-colors" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg font-bold text-secondary-fixed mb-space-sm uppercase tracking-wider">
              Direct Gifting
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-tertiary-fixed-dim">
              {DIRECT_GIFTING.map((item) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <li key={item.label}>
                    <a
                      className="hover:text-surface-lowest transition-colors"
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="pt-space-md border-t border-on-primary-fixed-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-tertiary-fixed-dim font-label-sm text-label-sm">
          <p>© {new Date().getFullYear()} Frudex Gourmet Inc. Pravasi Petti Heritage Reserve.</p>
          <div className="flex gap-space-md">
            <a className="hover:text-surface-lowest transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-surface-lowest transition-colors" href="#">
              Terms of Dispatch
            </a>
            <a className="hover:text-surface-lowest transition-colors" href="#">
              Botanical Registry
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
