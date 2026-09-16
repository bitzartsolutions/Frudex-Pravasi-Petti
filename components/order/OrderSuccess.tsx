"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

export function OrderSuccess({
  open,
  orderNumber,
  onClose,
}: {
  open: boolean;
  orderNumber: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-xl shadow-2xl text-center space-y-space-md relative transform transition-transform duration-300",
          open ? "scale-100" : "scale-95"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Order transmitted"
      >
        <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed mx-auto flex items-center justify-center">
          <Icon name="mark_email_read" size={36} />
        </div>
        <div className="space-y-space-xs">
          <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-widest">
            Order Transmitted
          </span>
          <h3 className="font-headline-lg text-headline-lg-mobile text-primary font-bold">
            YOUR PETTI IS READY!
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            We have prepared your exact manifest. You are being redirected to WhatsApp to
            confirm with our Pravasi concierge.
          </p>
        </div>
        <div className="p-space-sm bg-surface-container rounded-xl text-left font-label-sm text-label-sm space-y-1">
          <div className="flex justify-between text-on-surface-variant">
            <span>Manifest Ref:</span>
            <span className="font-bold text-primary font-mono">#{orderNumber ?? "—"}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Packaging Slot:</span>
            <span className="font-bold text-secondary">Secured &amp; Reserved</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-full bg-primary-container text-secondary-fixed hover:bg-primary font-label-md text-label-md font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          CONTINUE BROWSING
        </button>
      </div>
    </div>
  );
}
