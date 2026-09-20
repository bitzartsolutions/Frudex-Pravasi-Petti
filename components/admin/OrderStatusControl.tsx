"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import type { OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: OrderStatus) {
    setIsUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(
          json?.error ??
            (res.status === 401
              ? "Your session expired — refresh the page and sign in again."
              : "Failed to update status. Please try again.")
        );
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-1">
      <Select
        value={status}
        disabled={isUpdating}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="w-48"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      {error ? <p className="text-error text-label-sm font-label-sm">{error}</p> : null}
    </div>
  );
}
