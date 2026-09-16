import { cn } from "@/lib/utils/cn";

/**
 * Renders a Google Material Symbols Outlined glyph by name. The Stitch
 * design uses this icon font throughout (not an SVG icon library), so this
 * wrapper is used everywhere the original design shows an icon, to keep
 * the customer-facing UI pixel-identical. New admin-only UI may use
 * lucide-react instead.
 */
export function Icon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("material-symbols-outlined leading-none select-none", className)}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
