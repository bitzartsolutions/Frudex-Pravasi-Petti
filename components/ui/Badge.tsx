import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@/types/order";

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  CONFIRMED: "bg-tertiary-container text-secondary-fixed",
  PROCESSING: "bg-primary-container text-secondary-fixed",
  COMPLETED: "bg-secondary text-on-secondary",
  CANCELLED: "bg-error-container text-on-error-container",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wide",
        statusClasses[status]
      )}
    >
      {status}
    </span>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider bg-surface-container text-on-surface",
        className
      )}
    >
      {children}
    </span>
  );
}
