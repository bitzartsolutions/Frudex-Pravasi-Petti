import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/** Textarea styled to match the Stitch customer-form fields exactly. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
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
Textarea.displayName = "Textarea";
