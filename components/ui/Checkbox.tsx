import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-outline-variant text-secondary focus:ring-2 focus:ring-secondary/40",
        className
      )}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
