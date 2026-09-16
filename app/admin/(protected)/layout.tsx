import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Authentication is enforced by middleware.ts for the whole /admin/* tree
// (except /admin/login, which lives outside this route group). This layout
// only supplies the shared chrome for signed-in admin pages.
export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
