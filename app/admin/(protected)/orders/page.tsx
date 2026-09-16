import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderTable } from "@/components/admin/OrderTable";
import { getAllOrders } from "@/lib/data/adminCatalog";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="p-space-lg">
        <OrderTable orders={orders} />
      </div>
    </>
  );
}
