import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/** Text input styled to match the Stitch customer-form fields exactly. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-space-md py-3 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm shadow-inner",
        "focus:outline-none focus:ring-2 focus:ring-secondary/40",
        error && "ring-2 ring-error",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
