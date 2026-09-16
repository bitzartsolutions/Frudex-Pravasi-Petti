import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  // Main CTAs — matches the Stitch "ORDER VIA WHATSAPP" / hero CTA styling.
  primary:
    "bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed shadow-md",
  // Matches Stitch's "ADD TO PETTI" card button styling.
  accent: "bg-primary-container hover:bg-primary text-secondary-fixed shadow-sm",
  outline:
    "bg-surface-container-highest hover:bg-surface-variant text-primary",
  ghost: "bg-transparent hover:bg-surface-container text-primary",
  destructive: "bg-error hover:bg-error/90 text-on-error",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-space-md py-2 text-label-sm font-label-sm",
  md: "px-space-lg py-2.5 text-label-md font-label-md",
  lg: "px-space-xl py-4 text-label-lg font-label-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-space-xs rounded-full font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
