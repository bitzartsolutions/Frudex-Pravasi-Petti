import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductTable } from "@/components/admin/ProductTable";
import { getAllProductsWithVariants } from "@/lib/data/adminCatalog";

export default async function AdminProductsPage() {
  const products = await getAllProductsWithVariants();

  return (
    <>
      <AdminHeader title="Products" />
      <div className="p-space-lg space-y-space-md">
        <div className="flex justify-end">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md font-bold uppercase tracking-wider transition-colors"
          >
            <Plus size={16} />
            New Product
          </Link>
        </div>
        <ProductTable products={products} />
      </div>
    </>
  );
}
