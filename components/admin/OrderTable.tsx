"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function OrderTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="font-body-sm text-body-sm text-on-surface-variant py-space-lg text-center">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-variant/60">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low">
          <tr className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
            <th className="px-space-md py-space-sm">Order</th>
            <th className="px-space-md py-space-sm">Customer</th>
            <th className="px-space-md py-space-sm">WhatsApp</th>
            <th className="px-space-md py-space-sm">Total</th>
            <th className="px-space-md py-space-sm">Status</th>
            <th className="px-space-md py-space-sm">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/40">
          {orders.map((order) => (
            <tr key={order.id} className="font-body-sm text-body-sm">
              <td className="px-space-md py-space-sm">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-semibold text-primary hover:underline font-mono"
                >
                  {order.order_number}
                </Link>
              </td>
              <td className="px-space-md py-space-sm text-on-surface-variant">
                {order.customer_name}
              </td>
              <td className="px-space-md py-space-sm text-on-surface-variant">
                {order.whatsapp_number}
              </td>
              <td className="px-space-md py-space-sm font-semibold text-primary">
                {formatCurrency(order.total)}
              </td>
              <td className="px-space-md py-space-sm">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-space-md py-space-sm text-on-surface-variant whitespace-nowrap">
                {formatDateTime(order.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
