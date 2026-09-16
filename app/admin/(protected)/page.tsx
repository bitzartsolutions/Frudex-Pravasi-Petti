import { AdminHeader } from "@/components/admin/AdminHeader";
import { getDashboardStats } from "@/lib/data/adminStats";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Active Products", value: stats.activeProducts },
    { label: "Total Categories", value: stats.totalCategories },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Completed Orders", value: stats.completedOrders },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-space-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40"
          >
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              {card.label}
            </p>
            <p className="font-display-lg text-headline-lg text-primary mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
