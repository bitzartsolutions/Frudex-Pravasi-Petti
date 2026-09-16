"use client";

import { useMemo, useState } from "react";
import { CategoryTabs } from "@/components/categories/CategoryTabs";
import { ProductCard } from "./ProductCard";
import type { Category } from "@/types/category";
import type { ProductWithVariants } from "@/types/product";

export function ProductGrid({
  categories,
  products,
}: {
  categories: Category[];
  products: ProductWithVariants[];
}) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "ALL") return products;
    return products.filter((p) => p.category_slug === activeCategory);
  }, [products, activeCategory]);

  return (
    <section className="py-space-xl bg-surface" id="curate-grid">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-widest">
              Harvest Registry
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Select Pantry Treasures
            </h2>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
            Fresh harvest stock ready for packaging
          </div>
        </div>

        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="font-headline-sm text-headline-sm text-primary">
              No products in this category yet
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Check back soon, or browse another category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
