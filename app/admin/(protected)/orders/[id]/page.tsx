import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { getOrderWithItems } from "@/lib/data/adminCatalog";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/format";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderWithItems(id);

  if (!order) notFound();

  return (
    <>
      <AdminHeader title={`Order ${order.order_number}`} />
      <div className="p-space-lg space-y-space-lg max-w-3xl">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 space-y-space-sm">
          <div className="flex items-center justify-between flex-wrap gap-space-sm">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Placed {formatDateTime(order.created_at)}
              </p>
              <h2 className="font-headline-md text-headline-md text-primary">
                {order.customer_name}
              </h2>
            </div>
            <OrderStatusControl orderId={order.id} status={order.status} />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm font-body-sm text-body-sm">
            <div>
              <dt className="text-on-surface-variant">WhatsApp</dt>
              <dd className="font-semibold text-primary">{order.whatsapp_number}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Delivery Location</dt>
              <dd className="font-semibold text-primary">{order.delivery_location}</dd>
            </div>
            {order.customer_message ? (
              <div className="sm:col-span-2">
                <dt className="text-on-surface-variant">Gift Message</dt>
                <dd className="font-semibold text-primary">{order.customer_message}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-space-sm">
            Items
          </h3>
          <div className="divide-y divide-surface-variant/40">
            {order.items.map((item) => (
              <div key={item.id} className="py-space-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">{item.product_name}</p>
                  {item.variant_value ? (
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.variant_value} × {item.quantity}
                    </p>
                  ) : null}
                </div>
                <p className="font-semibold text-primary">{formatCurrency(item.total_price)}</p>
              </div>
            ))}
          </div>
          <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 space-y-1 font-body-sm text-body-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.additional_charge > 0 ? (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Additional Charges</span>
                <span>{formatCurrency(order.additional_charge)}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-primary pt-1">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
