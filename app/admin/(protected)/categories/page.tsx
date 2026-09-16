import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { getAllCategories } from "@/lib/data/adminCatalog";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <AdminHeader title="Categories" />
      <div className="p-space-lg space-y-space-md">
        <div className="flex justify-end">
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md font-bold uppercase tracking-wider transition-colors"
          >
            <Plus size={16} />
            New Category
          </Link>
        </div>
        <CategoryTable categories={categories} />
      </div>
    </>
  );
}
