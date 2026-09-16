import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("font-label-md text-label-md font-semibold text-primary", className)}
      {...props}
    />
  );
}
