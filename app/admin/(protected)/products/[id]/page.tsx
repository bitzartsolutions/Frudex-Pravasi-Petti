import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductEditClient } from "@/components/admin/ProductEditClient";
import { getProductWithVariants, getAllCategories } from "@/lib/data/adminCatalog";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductWithVariants(id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminHeader title={`Edit — ${product.name}`} />
      <div className="p-space-lg">
        <ProductEditClient product={product} categories={categories} />
      </div>
    </>
  );
}
