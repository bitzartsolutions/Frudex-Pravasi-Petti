"use client";

import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/category";

const ALL_VALUE = "ALL";

export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="flex items-center gap-space-xs overflow-x-auto pb-space-sm scrollbar-none mb-space-xl">
      <CategoryPill label="ALL" isActive={active === ALL_VALUE} onClick={() => onChange(ALL_VALUE)} />
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          label={category.name}
          isActive={active === category.slug}
          onClick={() => onChange(category.slug)}
        />
      ))}
    </div>
  );
}

function CategoryPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-space-md py-2.5 rounded-full font-label-md text-label-md tracking-wider uppercase transition-all whitespace-nowrap shadow-sm",
        isActive
          ? "bg-primary-container text-secondary-fixed"
          : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
      )}
    >
      {label}
    </button>
  );
}
